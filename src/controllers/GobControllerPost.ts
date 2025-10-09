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
