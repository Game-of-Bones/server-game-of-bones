import { RequestHandler } from "express";
import { Op } from "sequelize"; // ← IMPORTAR Op para operadores de Sequelize
import Post, { FossilType, Status } from "../models/Posts";
import { User } from "../models/User";
import { geocodeLocationWithCache } from "../services/geocoding.service";

interface PostRequestBody {
  title: string;
  summary: string;
  post_content: string;
  image_url?: string;
  discovery_date?: string;
  location?: string;
  paleontologist?: string;
  fossil_type?: FossilType;
  geological_period?: string;
  author_id: number;
  status?: Status;
  source?: string;
}

// -------------------- CREATE --------------------
/**
 * Crear un nuevo post
 * 
 * Si se proporciona una ubicación (location), automáticamente se geocodifica
 * para obtener las coordenadas (latitude, longitude) usando Nominatim
 */
export const createPost: RequestHandler<{}, any, PostRequestBody> = async (req, res) => {
  try {
    const {
      title,
      summary,
      post_content,
      image_url,
      discovery_date,
      location,
      paleontologist,
      fossil_type,
      geological_period,
      author_id,
      status,
      source,
    } = req.body;

    // Validación de campos requeridos
    if (!title || !summary || !post_content || !author_id) {
      return res.status(400).json({
        success: false,
        message: "Title, summary, post_content y author_id son requeridos",
      });
    }

    // Verificar que el autor existe
    const author = await User.findByPk(author_id);
    if (!author) {
      return res.status(404).json({ 
        success: false, 
        message: "Autor no encontrado" 
      });
    }

    // 🌍 GEOCODIFICACIÓN: Si hay ubicación, obtener coordenadas
    let latitude: number | null = null;
    let longitude: number | null = null;

    if (location && location.trim() !== '') {
      console.log(`🔍 Geocodificando ubicación del nuevo post: "${location}"`);
      
      const coordinates = await geocodeLocationWithCache(location);
      
      if (coordinates) {
        latitude = coordinates.latitude;
        longitude = coordinates.longitude;
        console.log(`✅ Coordenadas obtenidas: [${latitude}, ${longitude}]`);
      } else {
        console.warn(`⚠️ No se pudieron obtener coordenadas para: "${location}"`);
        // No es un error crítico, el post se crea igual sin coordenadas
      }
    }

    // Crear el post con coordenadas (si se obtuvieron)
    const newPost = await Post.create({
      title,
      summary,
      post_content,
      image_url,
      discovery_date: discovery_date ? new Date(discovery_date) : undefined,
      location,
      ...(latitude !== null && { latitude }), // ← Solo añadir si no es null
      ...(longitude !== null && { longitude }), // ← Solo añadir si no es null
      paleontologist,
      fossil_type: fossil_type ?? "bones_teeth",
      geological_period,
      author_id,
      status: status ?? "draft",
      source,
    });

    res.status(201).json({
      success: true,
      message: "Publicación registrada correctamente",
      data: newPost,
    });

  } catch (error) {
    console.error("Error al crear publicación:", error);
    res.status(500).json({ 
      success: false,
      error: "Error al crear la publicación" 
    });
  }
};

// -------------------- READ ALL --------------------
/**
 * Obtener todos los posts
 * 
 * TODO: Implementar filtros y paginación
 * Query params sugeridos:
 * - page: número de página
 * - limit: posts por página
 * - status: 'published' | 'draft'
 * - fossil_type: filtrar por tipo
 * - search: búsqueda en título/ubicación/paleontólogo
 */
export const getAllPosts: RequestHandler = async (req, res) => {
  try {
    // Obtener todos los posts con información del autor
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'email'] // Solo campos necesarios
        }
      ],
      order: [['createdAt', 'DESC']] // Más recientes primero
    });

    res.status(200).json({ 
      success: true,
      data: posts,
      total: posts.length
    });

  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    res.status(500).json({ 
      success: false,
      error: "Error al obtener las publicaciones" 
    });
  }
};

// -------------------- READ ONE --------------------
/**
 * Obtener un post por ID
 */
export const getPostById: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar post con información del autor
    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: "Publicación no encontrada" 
      });
    }

    res.status(200).json({ 
      success: true,
      data: post 
    });

  } catch (error) {
    console.error("Error al obtener publicación:", error);
    res.status(500).json({ 
      success: false,
      error: "Error al obtener la publicación" 
    });
  }
};

// -------------------- UPDATE --------------------
/**
 * Actualizar un post
 * 
 * Si se actualiza la ubicación (location), se vuelve a geocodificar
 * automáticamente para actualizar las coordenadas
 */
export const updatePost: RequestHandler<{ id: string }, any, Partial<PostRequestBody>> = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar el post
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: "Publicación no encontrada" 
      });
    }

    // 🌍 GEOCODIFICACIÓN: Si se actualiza la ubicación, re-geocodificar
    let updateData: any = { ...req.body };

    // Si se proporciona discovery_date, convertir a Date
    if (req.body.discovery_date) {
      updateData.discovery_date = new Date(req.body.discovery_date);
    }

    // Si se actualiza la ubicación, obtener nuevas coordenadas
    if (req.body.location !== undefined) {
      const newLocation = req.body.location;

      if (newLocation && newLocation.trim() !== '') {
        console.log(`🔍 Re-geocodificando ubicación actualizada: "${newLocation}"`);
        
        const coordinates = await geocodeLocationWithCache(newLocation);
        
        if (coordinates) {
          updateData.latitude = coordinates.latitude;
          updateData.longitude = coordinates.longitude;
          console.log(`✅ Coordenadas actualizadas: [${updateData.latitude}, ${updateData.longitude}]`);
        } else {
          // Si no se encuentran coordenadas, limpiar las existentes
          updateData.latitude = null;
          updateData.longitude = null;
          console.warn(`⚠️ No se pudieron obtener coordenadas para: "${newLocation}"`);
        }
      } else {
        // Si se borra la ubicación, limpiar también las coordenadas
        updateData.latitude = null;
        updateData.longitude = null;
      }
    }

    // Actualizar el post
    await post.update(updateData);

    res.status(200).json({
      success: true,
      message: "Publicación actualizada correctamente",
      data: post,
    });

  } catch (error) {
    console.error("Error al actualizar publicación:", error);
    res.status(500).json({ 
      success: false,
      error: "Error al actualizar la publicación" 
    });
  }
};

// -------------------- DELETE --------------------
/**
 * Eliminar un post (soft delete por paranoid: true)
 */
export const deletePost: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: "Publicación no encontrada" 
      });
    }

    // Soft delete (el registro queda en la BD con deletedAt)
    await post.destroy();

    res.status(200).json({ 
      success: true,
      message: "Publicación eliminada correctamente" 
    });

  } catch (error) {
    console.error("Error al eliminar publicación:", error);
    res.status(500).json({ 
      success: false,
      error: "Error al eliminar la publicación" 
    });
  }
};

// -------------------- GET POSTS FOR MAP --------------------
/**
 * Obtener posts con coordenadas para el mapa 3D
 * Solo retorna posts publicados que tienen latitude y longitude
 * 
 * Endpoint: GET /api/gameofbones/posts/map
 * Query params opcionales:
 * - fossil_type: filtrar por tipo de fósil
 * - geological_period: filtrar por período geológico
 */
export const getPostsForMap: RequestHandler = async (req, res) => {
  try {
    const { fossil_type, geological_period } = req.query;

    // Construir condiciones del WHERE
    const whereConditions: any = {
      status: 'published', // Solo posts publicados
      latitude: { [Op.ne]: null }, // Que tengan latitude
      longitude: { [Op.ne]: null }, // Que tengan longitude
    };

    // Filtros opcionales
    if (fossil_type) {
      whereConditions.fossil_type = fossil_type;
    }

    if (geological_period) {
      whereConditions.geological_period = geological_period;
    }

    // Consulta optimizada: solo campos necesarios para el mapa
    const posts = await Post.findAll({
      where: whereConditions,
      attributes: [
        'id',
        'title',
        'location',
        'latitude',
        'longitude',
        'image_url',
        'geological_period',
        'fossil_type',
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: posts,
      total: posts.length,
    });

  } catch (error) {
    console.error('Error al obtener posts para mapa:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener posts para el mapa',
    });
  }
};

/**
 * TODO: Endpoints adicionales sugeridos
 * 
 * 1. GET /posts/published - Solo posts publicados
 * 2. GET /posts/search - Búsqueda avanzada
 * 3. PATCH /posts/:id/publish - Cambiar estado a published
 * 4. POST /posts/bulk-geocode - Re-geocodificar posts existentes sin coordenadas
 */