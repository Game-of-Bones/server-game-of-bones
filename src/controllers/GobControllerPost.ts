import { Request, Response } from "express";
import Fossil, { FossilType, Status } from "../models/GobModelPost";

interface FossilRequestBody {
  title: string;
  summary: string;
  image_url?: string;
  discovery_date?: string;
  location?: string;
  palaeontologist?: string;
  fossil_type?: FossilType;
  geological_period?: string;
  author_id: number;
  status?: Status;
  source?: string;
}

export const createFossil = async (
  req: Request<{}, {}, FossilRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      summary,
      image_url,
      discovery_date,
      location,
      palaeontologist,
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
      palaeontologist,
      fossil_type,
      geological_period,
      author_id,
      status,
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
