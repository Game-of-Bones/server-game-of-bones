"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateComment = exports.validateCreateComment = void 0;
const validator_1 = __importDefault(require("validator"));
const validateCreateComment = (req, res, next) => {
    const errors = [];
    const { content } = req.body;
    // Validar que el contenido existe y es un string
    if (content === undefined || content === null) {
        res.status(400).json({
            success: false,
            errors: ['El contenido es requerido']
        });
        return;
    }
    if (typeof content !== 'string') {
        res.status(400).json({
            success: false,
            errors: ['El contenido debe ser texto']
        });
        return;
    }
    // Limpiar espacios
    const trimmedContent = content.trim();
    // Validar que existe contenido
    if (trimmedContent.length === 0) {
        errors.push('El contenido no puede estar vacío');
    }
    // Validar longitud máxima
    if (trimmedContent.length > 1000) {
        errors.push('El contenido no puede exceder los 1000 caracteres');
    }
    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            errors
        });
        return;
    }
    // Sanitizar HTML manteniendo URLs y comillas legibles
    req.body.content = validator_1.default.escape(trimmedContent);
    next();
};
exports.validateCreateComment = validateCreateComment;
const validateUpdateComment = (req, res, next) => {
    const errors = []; // Se agrega un array de errores
    const { content } = req.body;
    // Validar que el contenido existe y es un string
    if (content === undefined || content === null) {
        res.status(400).json({
            success: false,
            errors: ['El contenido es requerido'] // CAMBIO: 'error' a 'errors'
        });
        return;
    }
    if (typeof content !== 'string') {
        res.status(400).json({
            success: false,
            errors: ['El contenido debe ser texto'] // CAMBIO: 'error' a 'errors'
        });
        return;
    }
    // Limpiar espacios
    const trimmedContent = content.trim();
    // Validar que existe contenido
    if (trimmedContent.length === 0) {
        res.status(400).json({
            success: false,
            errors: ['El contenido no puede estar vacío'] // CAMBIO: 'error' a 'errors'
        });
        return;
    }
    // Validar longitud máxima
    if (trimmedContent.length > 1000) {
        res.status(400).json({
            success: false,
            errors: ['El contenido no puede exceder los 1000 caracteres'] // CAMBIO: 'error' a 'errors'
        });
        return;
    }
    // Sanitizar HTML
    req.body.content = validator_1.default.escape(trimmedContent);
    next();
};
exports.validateUpdateComment = validateUpdateComment;
//# sourceMappingURL=commentValidation.js.map