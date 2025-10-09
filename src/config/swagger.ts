import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Game of Bones API",
      version: "1.0.0",
      description: "Documentación de la API del proyecto Game of Bones 🦴",
    },
    servers: [
      {
        url: "http://localhost:3000", // Cambia según tu entorno
        description: "Servidor local",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Rutas donde buscará la documentación
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const swaggerDocs = (app: Express, port: number) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log(
    `📘 Swagger docs disponibles en: http://localhost:${port}/api-docs`
  );
};
