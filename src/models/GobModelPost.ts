import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// ENUMS
export type FossilType = "dinosaur" | "mammal" | "plant";
export type Status = "active" | "inactive" | "archived";

// ATRIBUTOS DEL MODELO
interface FossilAttributes {
  id: number;
  title: string;
  summary: string;
  image_url?: string | null;
  discovery_date?: Date | null;
  location?: string | null;
  palaeontologist?: string | null;
  fossil_type?: FossilType | null;
  geological_period?: string | null;
  author_id: number;
  status: Status;
  source?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// CAMPOS OPCIONALES AL CREAR
interface FossilCreationAttributes extends Optional<FossilAttributes, 
  "id" | "image_url" | "discovery_date" | "location" | "palaeontologist" | "fossil_type" | "geological_period" | "status" | "source" | "deletedAt"> {}

class Fossil extends Model<FossilAttributes, FossilCreationAttributes> implements FossilAttributes {
  public id!: number;
  public title!: string;
  public summary!: string;
  public image_url?: string | null;
  public discovery_date?: Date | null;
  public location?: string | null;
  public palaeontologist?: string | null;
  public fossil_type?: FossilType | null;
  public geological_period?: string | null;
  public author_id!: number;
  public status!: Status;
  public source?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Fossil.init(
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    summary: { type: DataTypes.TEXT, allowNull: false },
    image_url: { type: DataTypes.STRING, allowNull: true },
    discovery_date: { type: DataTypes.DATE, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true },
    palaeontologist: { type: DataTypes.STRING, allowNull: true },
    fossil_type: { type: DataTypes.ENUM("dinosaur", "mammal", "plant"), allowNull: true },
    geological_period: { type: DataTypes.STRING, allowNull: true },
    author_id: { type: DataTypes.BIGINT, allowNull: false },
    status: { type: DataTypes.ENUM("active", "inactive", "archived"), defaultValue: "active" },
    source: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    tableName: "fossils",
    timestamps: true,    // habilita createdAt y updatedAt
    paranoid: true,      // habilita deletedAt para soft delete
    underscored: true,   // convierte camelCase a snake_case en DB
  }
);

export default Fossil;
