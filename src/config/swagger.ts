openapi: 3.0.0
info:
  title: API Documentation
  version: 1.0.0
  description: Documentación completa de la API

servers:
  - url: http://localhost:3000/api
    description: Servidor de desarrollo
  - url: https://api.production.com/api
    description: Servidor de producción

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Token JWT obtenido del endpoint /auth/login

  schemas:
    Error:
      type: object
      properties:
        error:
          type: string
        details:
          type: array
          items:
            type: object

    User:
      type: object
      properties:
        id:
          type: string
        email:
          type: string
        createdAt:
          type: string
          format: date-time

  responses:
    UnauthorizedError:
      description: Token no proporcionado o inválido
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    
    ValidationError:
      description: Error de validación
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

paths:
  /auth/login:
    post:
      summary: Iniciar sesión
      tags:
        - Authentication
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
              properties:
                email:
                  type: string
                  format: email
                  example: user@example.com
                password:
                  type: string
                  format: password
                  example: Password123!
      responses:
        '200':
          description: Login exitoso
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                  user:
                    $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/ValidationError'
        '401':
          description: Credenciales inválidas

  /posts:
    get:
      summary: Obtener lista de posts
      tags:
        - Posts
      security:
        - BearerAuth: []
      parameters:
        - in: query
          name: page
          schema:
            type: integer
            default: 1
        - in: query
          name: limit
          schema:
            type: integer
            default: 10
      responses:
        '200':
          description: Lista de posts
        '401':
          $ref: '#/components/responses/UnauthorizedError'