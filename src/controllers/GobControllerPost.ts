import { RequestHandler } from "express";
import Fossil, { FossilType, Status } from "../models/GobModelPost";

// Definimos la interfaz para el body de la petición
interface FossilRequestBody {
  title: string;
  summary: string;
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

// Creamos el controller usando RequestHandler
export const createFossil: RequestHandler<{}, any, FossilRequestBody> = async (req, res) => {
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
      message: "Fósil registrado correctamente",
      data: newFossil,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el fósil" });
  }
};


/* -------------------- READ ALL -------------------- */
export const getAllFossils: RequestHandler = async (req, res) => {
  try {
    const fossils = await Fossil.findAll();
    res.status(200).json({ data: fossils });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los fósiles" });
  }
};

/* -------------------- READ ONE -------------------- */
export const getFossilById: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    const fossil = await Fossil.findByPk(id);

    if (!fossil) {
      return res.status(404).json({ error: "Fósil no encontrado" });
    }

    res.status(200).json({ data: fossil });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el fósil" });
  }
};

/* -------------------- UPDATE -------------------- */
export const updateFossil: RequestHandler<{ id: string }, any, Partial<FossilRequestBody>> = async (req, res) => {
  try {
    const { id } = req.params;
    const fossil = await Fossil.findByPk(id);

    if (!fossil) {
      return res.status(404).json({ error: "Fósil no encontrado" });
    }

    await fossil.update({
      ...req.body,
      discovery_date: req.body.discovery_date ? new Date(req.body.discovery_date) : fossil.discovery_date,
    });

    res.status(200).json({
      message: "Fósil actualizado correctamente",
      data: fossil,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el fósil" });
  }
};

/* -------------------- DELETE -------------------- */
export const deleteFossil: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    const fossil = await Fossil.findByPk(id);

    if (!fossil) {
      return res.status(404).json({ error: "Fósil no encontrado" });
    }

    await fossil.destroy();

    res.status(200).json({ message: "Fósil eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el fósil" });
  }
};
