import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { Express } from "express";

export default function swaggerDocs(app: Express) {
  const swaggerPath = path.resolve(__dirname, "../docs/swagger.yaml");
  const swaggerDocument = YAML.load(swaggerPath);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("📖 Swagger Docs disponible en /api-docs");
}
