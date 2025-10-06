import Fossil from "../models/GobModelPost.js";

// POST
export const createFossil = async (req, res) => {
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
      discovery_date,
      location,
      palaeontologist,
      fossil_type,
      geological_period,
      author_id,
      status,
      source,
      created_at: new Date(),
      updated_at: new Date(),
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

