import express from "express";
import fossilRoutes from "./routes/GobRoutesPost"; // Ajusta path
import sequelize from "./database/database";       // Ajusta path a tu conexión

const app = express();

app.use(express.json());
app.use("/api/fossils", fossilRoutes);

(async () => {
  try {
    await sequelize.sync();
    console.log("📦 Modelos sincronizados con la base de datos");
  } catch (error) {
    console.error("❌ Error al sincronizar modelos:", error);
  }
})();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
