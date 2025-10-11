// src/controllers/postsController.ts
import { RequestHandler } from "express";
import Post, { FossilType, Status } from "../models/Posts";
import { User } from "../models/User";

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

    if (!title || !summary || !post_content || !author_id) {
      return res.status(400).json({
        success: false,
        message: "Title, summary, post_content y author_id son requeridos",
      });
    }

    const author = await User.findByPk(author_id);
    if (!author) {
      return res.status(404).json({ success: false, message: "Autor no encontrado" });
    }

    const newPost = await Post.create({
      title,
      summary,
      post_content,
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
      message: "Publicación registrada correctamente",
      data: newPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la publicación" });
  }
};

// -------------------- READ ALL --------------------
export const getAllPosts: RequestHandler = async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json({ data: posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las publicaciones" });
  }
};

// -------------------- READ ONE --------------------
export const getPostById: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    res.status(200).json({ data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la publicación" });
  }
};

// -------------------- UPDATE --------------------
export const updatePost: RequestHandler<{ id: string }, any, Partial<PostRequestBody>> = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    await post.update({
      ...req.body,
      discovery_date: req.body.discovery_date ? new Date(req.body.discovery_date) : post.discovery_date,
    });

    res.status(200).json({
      message: "Publicación actualizada correctamente",
      data: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la publicación" });
  }
};

// -------------------- DELETE --------------------
export const deletePost: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    await post.destroy();

    res.status(200).json({ message: "Publicación eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la publicación" });
  }
};
