import express from "express";
import fossilRoutes from "../routes/GobRoutesPost.js

const app = express();

app.use(express.json());

// Prefijo para todas las rutas de fósiles
app.use("/api/fossils", fossilRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
