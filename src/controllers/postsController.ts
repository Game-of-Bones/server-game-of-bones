/**
 * POSTS CONTROLLER
 *
 * Maneja operaciones CRUD de posts (descubrimientos de fósiles):
 * - Listar posts (con filtros y paginación)
 * - Ver un post específico
 * - Crear nuevo post
 * - Actualizar post
 * - Eliminar post (soft delete)
 */

import { Request, Response } from 'express';
import { Post, CreatePostDTO, UpdatePostDTO, FossilType, PostStatus } from '../models/Post';
import { User } from '../models/User';
import { asyncHandler } from '../middleware/handleError';

// ✅ Tipos válidos de fósiles
const VALID_FOSSIL_TYPES = [
  'bones_teeth',
  'shell_exoskeletons',
  'plant_impressions',
  'tracks_traces',
  'amber_insects'
];

/**
 * Obtener todos los posts
 * GET /api/posts
 * Query params: ?status=published&fossil_type=bones_teeth&page=1&limit=10
 */
export const getAllPosts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const {
    status,
    fossil_type,
    user_id,
    page = '1',
    limit = '10',
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const offset = (pageNum - 1) * limitNum;

  // Construir filtros
  const where: any = {};

  if (status) where.status = status;
  if (fossil_type) where.fossil_type = fossil_type;
  if (user_id) where.user_id = parseInt(user_id as string);

  // Si no es admin, solo mostrar posts publicados (excepto propios)
  if (req.user?.role !== 'admin') {
    if (!user_id || parseInt(user_id as string) !== req.user?.id) {
      where.status = 'published';
    }
  }

  const { count, rows: posts } = await Post.findAndCountAll({
    where,
    limit: limitNum,
    offset,
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email', 'avatar_url'],
      },
    ],
    order: [['created_at', 'DESC']],
  });

  // ✅ CORRECCIÓN: Serializar posts con author incluido
  const serializedPosts = posts.map(post => {
    const postJson = post.toJSON();
    return {
      ...postJson,
      author: post.author ? {
        id: post.author.id,
        username: post.author.username,
        email: post.author.email,
        avatar_url: post.author.avatar_url,
      } : undefined,
    };
  });

  res.status(200).json({
    success: true,
    data: {
      posts: serializedPosts,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(count / limitNum),
      },
    },
  });
});

/**
 * Obtener un post por ID
 * GET /api/posts/:id
 */
export const getPostById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const post = await Post.findByPk(id, {
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email', 'avatar_url'],
      },
    ],
  });

  if (!post) {
    res.status(404).json({
      success: false,
      message: 'Post no encontrado',
    });
    return;
  }

  // Si el post es borrador, solo el autor o admin pueden verlo
  if (post.status === 'draft') {
    if (req.user?.role !== 'admin' && req.user?.id !== post.user_id) {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver este post',
      });
      return;
    }
  }

  // Añadir contadores
  const likes_count = await post.getLikesCount();
  const comments_count = await post.getCommentsCount();

  // ✅ CORRECCIÓN: Incluir author en la respuesta
  res.status(200).json({
    success: true,
    data: {
      ...post.toJSON(),
      author: post.author ? {
        id: post.author.id,
        username: post.author.username,
        email: post.author.email,
        avatar_url: post.author.avatar_url,
      } : undefined,
      likes_count,
      comments_count,
    },
  });
});

/**
 * Crear nuevo post
 * POST /api/posts
 * Requiere autenticación
 */
export const createPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const {
    title,
    summary,
    post_content,
    image_url,
    discovery_date,
    location,
    latitude,
    longitude,
    paleontologist,
    fossil_type,
    geological_period,
    status,
    source
  } = req.body;

  // ✅ Validar campos requeridos
  if (!title || !summary || !post_content) {
    res.status(400).json({
      success: false,
      message: 'Title, summary y post_content son campos requeridos',
    });
    return;
  }

  // ✅ CORRECCIÓN: Validar fossil_type antes de crear
  if (fossil_type && !VALID_FOSSIL_TYPES.includes(fossil_type)) {
    res.status(400).json({
      success: false,
      message: `Tipo de fósil inválido. Debe ser uno de: ${VALID_FOSSIL_TYPES.join(', ')}`,
    });
    return;
  }

  const post = await Post.create({
    title,
    summary,
    post_content,
    image_url,
    discovery_date: discovery_date ? new Date(discovery_date) : undefined,
    location,
    latitude,
    longitude,
    paleontologist,
    fossil_type: fossil_type || 'bones_teeth',
    geological_period,
    user_id: req.user!.id, // Tomar del JWT, no del body
    status: status || 'draft',
    source,
  });

  res.status(201).json({
    success: true,
    message: 'Post creado exitosamente',
    data: post.toJSON(),
  });
});

/**
 * Actualizar post
 * PUT /api/posts/:id
 * Requiere ser el autor o admin
 */
export const updatePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const post = await Post.findByPk(id);

  if (!post) {
    res.status(404).json({
      success: false,
      message: 'Post no encontrado',
    });
    return;
  }

  // Verificar permisos (owner o admin)
  if (req.user!.role !== 'admin' && req.user!.id !== post.user_id) {
    res.status(403).json({
      success: false,
      message: 'No tienes permiso para editar este post',
    });
    return;
  }

  const updateData: UpdatePostDTO = req.body;

  // No permitir cambiar el user_id
  delete (updateData as any).user_id;

  // ✅ Validar fossil_type si se está actualizando
  if (updateData.fossil_type && !VALID_FOSSIL_TYPES.includes(updateData.fossil_type)) {
    res.status(400).json({
      success: false,
      message: `Tipo de fósil inválido. Debe ser uno de: ${VALID_FOSSIL_TYPES.join(', ')}`,
    });
    return;
  }

  await post.update(updateData);

  res.status(200).json({
    success: true,
    message: 'Post actualizado exitosamente',
    data: post.toJSON(),
  });
});

/**
 * Eliminar post (soft delete)
 * DELETE /api/posts/:id
 * Requiere ser el autor o admin
 */
export const deletePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const post = await Post.findByPk(id);

  if (!post) {
    res.status(404).json({
      success: false,
      message: 'Post no encontrado',
    });
    return;
  }

  // Verificar permisos (owner o admin)
  if (req.user!.role !== 'admin' && req.user!.id !== post.user_id) {
    res.status(403).json({
      success: false,
      message: 'No tienes permiso para eliminar este post',
    });
    return;
  }

  await post.destroy(); // Soft delete (paranoid: true)

  res.status(200).json({
    success: true,
    message: 'Post eliminado exitosamente',
  });
});
