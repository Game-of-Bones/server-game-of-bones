// import { RequestHandler } from "express";
// import Fossil, { FossilType, Status } from "../models/GobModelPost";

// // Definimos la interfaz para el body de la petición
// interface FossilRequestBody {
//   title: string;
//   summary: string;
//   image_url?: string;
//   discovery_date?: string;
//   location?: string;
//   paleontologist?: string;
//   fossil_type?: FossilType;
//   geological_period?: string;
//   author_id: number;
//   status?: Status;
//   source?: string;
// }

// // Creamos el controller usando RequestHandler
// export const createFossil: RequestHandler<{}, any, FossilRequestBody> = async (req, res) => {
//   try {
//     const {
//       title,
//       summary,
//       image_url,
//       discovery_date,
//       location,
//       paleontologist,
//       fossil_type,
//       geological_period,
//       author_id,
//       status,
//       source,
//     } = req.body;

//     const newFossil = await Fossil.create({
//       title,
//       summary,
//       image_url,
//       discovery_date: discovery_date ? new Date(discovery_date) : undefined,
//       location,
//       paleontologist,
//       fossil_type: fossil_type ?? "bones_teeth",
//       geological_period,
//       author_id,
//       status: status ?? "draft",
//       source,
//     });

//     res.status(201).json({
//       message: "Fósil registrado correctamente",
//       data: newFossil,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error al crear el fósil" });
//   }
// };


// /* -------------------- READ ALL -------------------- */
// export const getAllFossils: RequestHandler = async (req, res) => {
//   try {
//     const fossils = await Fossil.findAll();
//     res.status(200).json({ data: fossils });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error al obtener los fósiles" });
//   }
// };

// /* -------------------- READ ONE -------------------- */
// export const getFossilById: RequestHandler<{ id: string }> = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const fossil = await Fossil.findByPk(id);

//     if (!fossil) {
//       return res.status(404).json({ error: "Fósil no encontrado" });
//     }

//     res.status(200).json({ data: fossil });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error al obtener el fósil" });
//   }
// };

// /* -------------------- UPDATE -------------------- */
// export const updateFossil: RequestHandler<{ id: string }, any, Partial<FossilRequestBody>> = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const fossil = await Fossil.findByPk(id);

//     if (!fossil) {
//       return res.status(404).json({ error: "Fósil no encontrado" });
//     }

//     await fossil.update({
//       ...req.body,
//       discovery_date: req.body.discovery_date ? new Date(req.body.discovery_date) : fossil.discovery_date,
//     });

//     res.status(200).json({
//       message: "Fósil actualizado correctamente",
//       data: fossil,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error al actualizar el fósil" });
//   }
// };

// /* -------------------- DELETE -------------------- */
// export const deleteFossil: RequestHandler<{ id: string }> = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const fossil = await Fossil.findByPk(id);

//     if (!fossil) {
//       return res.status(404).json({ error: "Fósil no encontrado" });
//     }

//     await fossil.destroy();

//     res.status(200).json({ message: "Fósil eliminado correctamente" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error al eliminar el fósil" });
//   }
// };

// src/controllers/GobControllerPost.ts
import { Request, Response } from "express";
import Fossil, { FossilType, Status } from "../models/GobModelPost";
import { User } from "../models/User";

/**
 * Crear un nuevo fósil/post
 * POST /gameofbones/api/fossils
 */
export const createFossil = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      summary,
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

    // Validaciones básicas
    if (!title || !summary || !author_id) {
      res.status(400).json({
        success: false,
        message: 'Title, summary y author_id son requeridos'
      });
      return;
    }

    // Verificar que el autor existe
    const author = await User.findByPk(author_id);
    if (!author) {
      res.status(404).json({
        success: false,
        message: 'Autor no encontrado'
      });
      return;
    }

    const newFossil = await Fossil.create({
      title,
      summary,
      image_url,
      discovery_date: discovery_date ? new Date(discovery_date) : undefined,
      location,
      paleontologist,
      fossil_type: fossil_type ?? "bones_teeth",
      geological_period,
      author_id,
      status: status ?? "draft",
      source,
    });

    res.status(201).json({
      success: true,
      message: "Fósil registrado correctamente",
      data: newFossil,
    });
  } catch (error: any) {
    console.error('Error al crear fósil:', error);
    res.status(500).json({
      success: false,
      message: "Error al crear el fósil",
      error: error.message
    });
  }
};

/**
 * Obtener todos los fósiles
 * GET /gameofbones/api/fossils
 */
export const getAllFossils = async (req: Request, res: Response): Promise<void> => {
  try {
    const fossils = await Fossil.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: fossils,
      count: fossils.length
    });
  } catch (error: any) {
    console.error('Error al obtener fósiles:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los fósiles",
      error: error.message
    });
  }
};

/**
 * Obtener un fósil por ID
 * GET /gameofbones/api/fossils/:id
 */
export const getFossilById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const fossil = await Fossil.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    if (!fossil) {
      res.status(404).json({
        success: false,
        message: "Fósil no encontrado"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: fossil
    });
  } catch (error: any) {
    console.error('Error al obtener fósil:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el fósil",
      error: error.message
    });
  }
};

/**
 * Actualizar un fósil
 * PUT /gameofbones/api/fossils/:id
 */
export const updateFossil = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const fossil = await Fossil.findByPk(id);

    if (!fossil) {
      res.status(404).json({
        success: false,
        message: "Fósil no encontrado"
      });
      return;
    }

    // Verificar permisos: solo el autor o admin pueden editar
    if (fossil.author_id !== userId && userRole !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar este fósil'
      });
      return;
    }

    // Actualizar
    await fossil.update({
      ...req.body,
      discovery_date: req.body.discovery_date
        ? new Date(req.body.discovery_date)
        : fossil.discovery_date,
    });

    res.status(200).json({
      success: true,
      message: "Fósil actualizado correctamente",
      data: fossil,
    });
  } catch (error: any) {
    console.error('Error al actualizar fósil:', error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el fósil",
      error: error.message
    });
  }
};

/**
 * Eliminar un fósil (soft delete)
 * DELETE /gameofbones/api/fossils/:id
 */
export const deleteFossil = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const fossil = await Fossil.findByPk(id);

    if (!fossil) {
      res.status(404).json({
        success: false,
        message: "Fósil no encontrado"
      });
      return;
    }

    // Verificar permisos: solo el autor o admin pueden eliminar
    if (fossil.author_id !== userId && userRole !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este fósil'
      });
      return;
    }

    // Soft delete
    await fossil.destroy();

    res.status(200).json({
      success: true,
      message: "Fósil eliminado correctamente"
    });
  } catch (error: any) {
    console.error('Error al eliminar fósil:', error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar el fósil",
      error: error.message
    });
  }
};
