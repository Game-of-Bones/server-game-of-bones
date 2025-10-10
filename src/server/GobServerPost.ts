import express from "express";
import postRoutes from "../routes/GobRoutesPost";
import sequelize from "../database/database";

const app = express();
app.use(express.json());

// 🔹 Prefijo de la API alineado con tu compañera
app.use("/gameofbones/posts", postRoutes);

// Middleware opcional: ruta raíz de prueba
app.get("/gameofbones", (req, res) => {
  res.send({
    success: true,
    message: "API Game of Bones activa",
    availableEndpoints: {
      posts: "/gameofbones/posts",
    },
  });
});

// Imprimir rutas activas para depuración
console.log("🔎 Rutas activas:");
app._router.stack
  .filter(r => r.route)
  .forEach(r => console.log(r.route.path));

// Conexión a la base de datos y sincronización
(async () => {
  try {
    await sequelize.authenticate();
    console.log("🟢 Conexión con la base de datos establecida correctamente");

    await sequelize.sync({ alter: true });
    console.log("📦 Modelos sincronizados con la base de datos");
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
  }
})();

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
