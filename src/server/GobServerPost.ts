import express from "express";
import fossilRoutes from "../routes/GobRoutesPost";
import sequelize from "../database/database";

const app = express();

app.use(express.json());
app.use("/api/fossils", fossilRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("🟢 Conexión con la base de datos establecida correctamente");

    await sequelize.sync(); // o .sync({ alter: true }) en desarrollo
    console.log("📦 Modelos sincronizados con la base de datos");
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
  }
})();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
