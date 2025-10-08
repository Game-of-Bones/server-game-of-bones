import express from "express";
import fossilRoutes from "../routes/GobRoutesPost";
import sequelize from "../config/database";

const app = express();
app.use(express.json());

app.use("/api/fossils", fossilRoutes);

(async () => {
  try {
    await sequelize.sync(); // sincronizar modelos
    console.log("📦 Modelos sincronizados con la base de datos");
  } catch (error) {
    console.error("❌ Error al sincronizar modelos:", error);
  }
})();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
