import { Request, Response, NextFunction } from 'express';
import { Pool } from 'mysql2/promise';
import { CommentsController } from '../../controllers/commentsController';
import { CommentsRepository } from '../../database/repositories/commentsRepository';

// Mock del repositorio
jest.mock('../../database/repositories/commentsRepository');

describe('CommentsController', () => {
  let controller: CommentsController;
  let mockRepository: jest.Mocked<CommentsRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Crear mocks
    const mockPool = {} as Pool;
    controller = new CommentsController(mockPool);
    mockRepository = (controller as any).repository as jest.Mocked<CommentsRepository>;

    // Reset del request y response
    mockRequest = {
      params: {},
      query: {},
      body: {},
      user: { id: 1, role: 'user' }
    } as any;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCommentsByPost', () => {
    it('debe obtener comentarios de un post correctamente', async () => {
      mockRequest.params = { postId: '1' };
      mockRequest.query = { limit: '10', offset: '0' };

      const mockComments = [
        {
          id: 1n,
          post_id: 1n,
          user_id: 1n,
          content: 'Comentario 1',
          created_at: new Date(),
          username: 'user1',
          user_email: 'user1@test.com'
        }
      ];

      mockRepository.postExists.mockResolvedValue(true);
      mockRepository.findByPostId.mockResolvedValue(mockComments);
      mockRepository.countByPostId.mockResolvedValue(1);

      await controller.getCommentsByPost(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          comments: mockComments,
          pagination: {
            total: 1,
            limit: 10,
            offset: 0,
            hasMore: false
          }
        }
      });
    });

    it('debe retornar 404 si el post no existe', async () => {
      mockRequest.params = { postId: '999' };
      mockRepository.postExists.mockResolvedValue(false);

      await controller.getCommentsByPost(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Post no encontrado'
      });
    });

    it('debe manejar errores correctamente', async () => {
      mockRequest.params = { postId: '1' };
      const error = new Error('Database error');
      mockRepository.postExists.mockRejectedValue(error);

      await controller.getCommentsByPost(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getCommentById', () => {
    it('debe obtener un comentario por ID', async () => {
      mockRequest.params = { id: '1' };

      const mockComment = {
        id: 1n,
        post_id: 1n,
        user_id: 1n,
        content: 'Comentario de prueba',
        created_at: new Date(),
        username: 'testuser',
        user_email: 'test@test.com'
      };

      mockRepository.findByIdWithUser.mockResolvedValue(mockComment);

      await controller.getCommentById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockComment
      });
    });

    it('debe retornar 404 si el comentario no existe', async () => {
      mockRequest.params = { id: '999' };
      mockRepository.findByIdWithUser.mockResolvedValue(null);

      await controller.getCommentById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Comentario no encontrado'
      });
    });
  });

  describe('createComment', () => {
    beforeEach(() => {
      mockRequest.params = { postId: '1' };
      mockRequest.body = { content: 'Nuevo comentario' };
      (mockRequest as any).user = { id: 1 };
    });

    it('debe crear un comentario correctamente', async () => {
      const newComment = {
        id: 1n,
        post_id: 1n,
        user_id: 1n,
        content: 'Nuevo comentario',
        created_at: new Date()
      };

      const commentWithUser = {
        ...newComment,
        username: 'testuser',
        user_email: 'test@test.com'
      };

      mockRepository.postExists.mockResolvedValue(true);
      mockRepository.create.mockResolvedValue(newComment);
      mockRepository.findByIdWithUser.mockResolvedValue(commentWithUser);

      await controller.createComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: commentWithUser,
        message: 'Comentario creado exitosamente'
      });
    });

    it('debe retornar 401 si el usuario no está autenticado', async () => {
      (mockRequest as any).user = null;

      await controller.createComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Usuario no autenticado'
      });
    });

    it('debe retornar 404 si el post no existe', async () => {
      mockRepository.postExists.mockResolvedValue(false);

      await controller.createComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Post no encontrado'
      });
    });
  });

  describe('updateComment', () => {
    beforeEach(() => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { content: 'Contenido actualizado' };
      (mockRequest as any).user = { id: 1 };
    });

    it('debe actualizar un comentario correctamente', async () => {
      const existingComment = {
        id: 1n,
        post_id: 1n,
        user_id: 1n,
        content: 'Contenido original',
        created_at: new Date()
      };

      const updatedComment = {
        ...existingComment,
        content: 'Contenido actualizado'
      };

      mockRepository.findById.mockResolvedValue(existingComment);
      mockRepository.isAuthor.mockResolvedValue(true);
      mockRepository.update.mockResolvedValue(updatedComment);

      await controller.updateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: updatedComment,
        message: 'Comentario actualizado exitosamente'
      });
    });

    it('debe retornar 404 si el comentario no existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await controller.updateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it('debe retornar 403 si el usuario no es el autor', async () => {
      const comment = {
        id: 1n,
        post_id: 1n,
        user_id: 2n,
        content: 'Contenido',
        created_at: new Date()
      };

      mockRepository.findById.mockResolvedValue(comment);
      mockRepository.isAuthor.mockResolvedValue(false);

      await controller.updateComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'No tienes permiso para editar este comentario'
      });
    });
  });

  describe('deleteComment', () => {
    beforeEach(() => {
      mockRequest.params = { id: '1' };
      (mockRequest as any).user = { id: 1, role: 'user' };
    });

    it('debe eliminar un comentario como autor', async () => {
      const comment = {
        id: 1n,
        post_id: 1n,
        user_id: 1n,
        content: 'Contenido',
        created_at: new Date()
      };

      mockRepository.findById.mockResolvedValue(comment);
      mockRepository.isAuthor.mockResolvedValue(true);
      mockRepository.delete.mockResolvedValue(true);

      await controller.deleteComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Comentario eliminado exitosamente'
      });
    });

    it('debe eliminar un comentario como admin aunque no sea el autor', async () => {
      (mockRequest as any).user = { id: 2, role: 'admin' };

      const comment = {
        id: 1n,
        post_id: 1n,
        user_id: 1n,
        content: 'Contenido',
        created_at: new Date()
      };

      mockRepository.findById.mockResolvedValue(comment);
      mockRepository.isAuthor.mockResolvedValue(false);
      mockRepository.delete.mockResolvedValue(true);

      await controller.deleteComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('debe retornar 403 si no es autor ni admin', async () => {
      const comment = {
        id: 1n,
        post_id: 1n,
        user_id: 2n,
        content: 'Contenido',
        created_at: new Date()
      };

      mockRepository.findById.mockResolvedValue(comment);
      mockRepository.isAuthor.mockResolvedValue(false);

      await controller.deleteComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
  });
});