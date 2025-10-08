import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// Enums
export type FossilType = "dinosaur" | "mammal" | "plant";
export type Status = "active" | "inactive" | "archived";

// Atributos del modelo
interface FossilAttributes {
  id: number;
  title: string;
  summary: string;
  image_url?: string;
  discovery_date?: Date;
  location?: string;
  palaeontologist?: string;
  fossil_type?: FossilType;
  geological_period?: string;
  author_id: number;
  status?: Status;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  source?: string;
}

// Campos opcionales al crear
interface FossilCreationAttributes extends Optional<FossilAttributes, "id" | "created_at" | "updated_at" | "deleted_at"> {}

class Fossil extends Model<FossilAttributes, FossilCreationAttributes> implements FossilAttributes {
  public id!: number;
  public title!: string;
  public summary!: string;
  public image_url?: string;
  public discovery_date?: Date;
  public location?: string;
  public palaeontologist?: string;
  public fossil_type?: FossilType;
  public geological_period?: string;
  public author_id!: number;
  public status?: Status;
  public created_at?: Date;
  public updated_at?: Date;
  public deleted_at?: Date;
  public source?: string;
}

Fossil.init(
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    summary: { type: DataTypes.TEXT, allowNull: false },
    image_url: { type: DataTypes.STRING },
    discovery_date: { type: DataTypes.DATE },
    location: { type: DataTypes.STRING },
    palaeontologist: { type: DataTypes.STRING },
    fossil_type: { type: DataTypes.ENUM("dinosaur", "mammal", "plant") },
    geological_period: { type: DataTypes.STRING },
    author_id: { type: DataTypes.BIGINT, allowNull: false },
    status: { type: DataTypes.ENUM("active", "inactive", "archived"), defaultValue: "active" },
    source: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    deleted_at: { type: DataTypes.DATE },
  },
  {
    sequelize,
    tableName: "fossils",
    timestamps: false,
    paranoid: true, // soft delete
  }
);

export default Fossil;
