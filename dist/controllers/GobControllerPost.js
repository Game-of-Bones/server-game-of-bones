"use strict";
// import { RequestHandler } from "express";
// import Fossil, { FossilType, Status } from "../models/GobModelPost";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFossil = exports.updateFossil = exports.getFossilById = exports.getAllFossils = exports.createFossil = void 0;
const GobModelPost_1 = __importDefault(require("../models/GobModelPost"));
const User_1 = require("../models/User");
/**
 * Crear un nuevo fósil/post
 * POST /gameofbones/api/fossils
 */
const createFossil = async (req, res) => {
    try {
        const { title, summary, image_url, discovery_date, location, paleontologist, fossil_type, geological_period, author_id, status, source, } = req.body;
        // Validaciones básicas
        if (!title || !summary || !author_id) {
            res.status(400).json({
                success: false,
                message: 'Title, summary y author_id son requeridos'
            });
            return;
        }
        // Verificar que el autor existe
        const author = await User_1.User.findByPk(author_id);
        if (!author) {
            res.status(404).json({
                success: false,
                message: 'Autor no encontrado'
            });
            return;
        }
        const newFossil = await GobModelPost_1.default.create({
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
    }
    catch (error) {
        console.error('Error al crear fósil:', error);
        res.status(500).json({
            success: false,
            message: "Error al crear el fósil",
            error: error.message
        });
    }
};
exports.createFossil = createFossil;
/**
 * Obtener todos los fósiles
 * GET /gameofbones/api/fossils
 */
const getAllFossils = async (req, res) => {
    try {
        const fossils = await GobModelPost_1.default.findAll({
            include: [
                {
                    model: User_1.User,
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
    }
    catch (error) {
        console.error('Error al obtener fósiles:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener los fósiles",
            error: error.message
        });
    }
};
exports.getAllFossils = getAllFossils;
/**
 * Obtener un fósil por ID
 * GET /gameofbones/api/fossils/:id
 */
const getFossilById = async (req, res) => {
    try {
        const { id } = req.params;
        const fossil = await GobModelPost_1.default.findByPk(id, {
            include: [
                {
                    model: User_1.User,
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
    }
    catch (error) {
        console.error('Error al obtener fósil:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener el fósil",
            error: error.message
        });
    }
};
exports.getFossilById = getFossilById;
/**
 * Actualizar un fósil
 * PUT /gameofbones/api/fossils/:id
 */
const updateFossil = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;
        const fossil = await GobModelPost_1.default.findByPk(id);
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
    }
    catch (error) {
        console.error('Error al actualizar fósil:', error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar el fósil",
            error: error.message
        });
    }
};
exports.updateFossil = updateFossil;
/**
 * Eliminar un fósil (soft delete)
 * DELETE /gameofbones/api/fossils/:id
 */
const deleteFossil = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;
        const fossil = await GobModelPost_1.default.findByPk(id);
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
    }
    catch (error) {
        console.error('Error al eliminar fósil:', error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar el fósil",
            error: error.message
        });
    }
};
exports.deleteFossil = deleteFossil;
//# sourceMappingURL=GobControllerPost.js.map