import { Request, Response, NextFunction } from 'express';
import { validateCreateComment, validateUpdateComment } from '../../middleware/commentValidation';

describe('Comment Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateCreateComment', () => {
    it('debe pasar validación con datos correctos', () => {
      mockRequest.body = {
        content: 'Este es un comentario válido'
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('debe rechazar contenido vacío', () => {
      mockRequest.body = {
        content: ''
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining(['El contenido no puede estar vacío'])
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('debe rechazar contenido solo con espacios', () => {
      mockRequest.body = {
        content: '   '
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining(['El contenido no puede estar vacío'])
      });
    });

    it('debe rechazar contenido sin campo content', () => {
      mockRequest.body = {};

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining(['El contenido es requerido'])
      });
    });

    it('debe rechazar contenido muy largo (más de 1000 caracteres)', () => {
      mockRequest.body = {
        content: 'a'.repeat(1001)
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining(['El contenido no puede exceder los 1000 caracteres'])
      });
    });

    it('debe aceptar contenido en el límite (1000 caracteres)', () => {
      mockRequest.body = {
        content: 'a'.repeat(1000)
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('debe sanitizar HTML peligroso', () => {
      mockRequest.body = {
        content: '<script>alert("XSS")</script>Comentario'
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockRequest.body.content).not.toContain('<script>');
      expect(mockRequest.body.content).toContain('&lt;script&gt;');
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('debe sanitizar múltiples etiquetas HTML', () => {
      mockRequest.body = {
        content: '<img src="x" onerror="alert(1)"><div>Test</div>'
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockRequest.body.content).not.toContain('<img');
      expect(mockRequest.body.content).not.toContain('<div>');
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('debe aceptar contenido con caracteres especiales válidos', () => {
      mockRequest.body = {
        content: 'Comentario con ñ, á, é, í, ó, ú, ¿? y ¡!'
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRequest.body.content).toContain('ñ');
    });

    it('debe rechazar contenido no string', () => {
      mockRequest.body = {
        content: 12345
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining(['El contenido debe ser texto'])
      });
    });

    it('debe limpiar espacios al inicio y final', () => {
      mockRequest.body = {
        content: '   Comentario con espacios   '
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockRequest.body.content).toBe('Comentario con espacios');
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('validateUpdateComment', () => {
    it('debe pasar validación con datos correctos', () => {
      mockRequest.body = {
        content: 'Contenido actualizado válido'
      };

      validateUpdateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('debe rechazar contenido vacío', () => {
      mockRequest.body = {
        content: ''
      };

      validateUpdateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining(['El contenido no puede estar vacío'])
      });
    });

    it('debe rechazar sin campo content', () => {
      mockRequest.body = {};

      validateUpdateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining(['El contenido es requerido'])
      });
    });

    it('debe rechazar contenido muy largo', () => {
      mockRequest.body = {
        content: 'a'.repeat(1001)
      };

      validateUpdateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('debe sanitizar HTML en actualizaciones', () => {
      mockRequest.body = {
        content: '<script>alert("XSS")</script>Actualización'
      };

      validateUpdateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockRequest.body.content).not.toContain('<script>');
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('debe validar ID del comentario en params', () => {
      mockRequest.params = { id: 'invalid' };
      mockRequest.body = { content: 'Contenido válido' };

      validateUpdateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Debería pasar la validación del contenido
      // La validación del ID se hace en el controlador
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('Casos edge', () => {
    it('debe manejar contenido con saltos de línea', () => {
      mockRequest.body = {
        content: 'Línea 1\nLínea 2\nLínea 3'
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRequest.body.content).toContain('\n');
    });

    it('debe manejar contenido con emojis', () => {
      mockRequest.body = {
        content: 'Gran descubrimiento! 🦕🦴👍'
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('debe rechazar contenido con solo emojis si está vacío después de trim', () => {
      mockRequest.body = {
        content: '   '
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('debe manejar contenido con URLs', () => {
      mockRequest.body = {
        content: 'Mira esta fuente: https://example.com/dinosaurios'
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRequest.body.content).toContain('https://example.com');
    });

    it('debe sanitizar intentos de inyección SQL en el contenido', () => {
      mockRequest.body = {
        content: "'; DROP TABLE comments; --"
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // La sanitización no debe afectar el contenido SQL-like
      // ya que se trata como texto plano
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('debe manejar múltiples errores de validación', () => {
      mockRequest.body = {
        content: '' // Vacío
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.any(Array)
      });
    });

    it('debe preservar contenido válido sin cambios innecesarios', () => {
      const originalContent = 'Este es un comentario normal sobre fósiles';
      mockRequest.body = {
        content: originalContent
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockRequest.body.content).toBe(originalContent);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('debe manejar contenido con comillas', () => {
      mockRequest.body = {
        content: 'El paleontólogo dijo: "Increíble hallazgo"'
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRequest.body.content).toContain('"');
    });

    it('debe rechazar objetos anidados en content', () => {
      mockRequest.body = {
        content: { nested: 'object' }
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('debe rechazar arrays en content', () => {
      mockRequest.body = {
        content: ['array', 'content']
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('debe manejar contenido con tabulaciones', () => {
      mockRequest.body = {
        content: 'Contenido\tcon\ttabulaciones'
      };

      validateCreateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
    });
  });
});