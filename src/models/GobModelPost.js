// models/Post-Fossil.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Fossil = sequelize.define("Fossil", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  discovery_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  palaeontologist: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fossil_type: {
    type: DataTypes.ENUM("dinosaur", "plant", "marine", "mammal", "other"),
    allowNull: false,
  },
  geological_period: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("draft", "published", "archived"),
    defaultValue: "draft",
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "fossils",
  timestamps: false,
});

export default Fossil;

