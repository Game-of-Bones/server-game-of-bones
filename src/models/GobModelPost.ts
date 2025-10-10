import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/database"; // Ajusta si tu path es diferente

// Tipos para TypeScript
export type FossilType =
  | "bones_teeth"
  | "shell_exoskeletons"
  | "plant_impressions"
  | "tracks_traces"
  | "amber_insects";

export type Status = "draft" | "published";

// Atributos del modelo
interface FossilAttributes {
  id: number;
  title: string;
  summary: string;
  image_url?: string | null;
  discovery_date?: Date | null;
  location?: string | null;
  paleontologist?: string | null;
  fossil_type: FossilType;
  geological_period?: string | null;
  author_id: number;
  status: Status;
  source?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// Campos opcionales al crear
interface FossilCreationAttributes
  extends Optional<
    FossilAttributes,
    | "id"
    | "image_url"
    | "discovery_date"
    | "location"
    | "paleontologist"
    | "geological_period"
    | "status"
    | "source"
    | "deletedAt"
  > {}

class Fossil extends Model<FossilAttributes, FossilCreationAttributes>
  implements FossilAttributes {
  public id!: number;
  public title!: string;
  public summary!: string;
  public image_url?: string | null;
  public discovery_date?: Date | null;
  public location?: string | null;
  public paleontologist?: string | null;
  public fossil_type!: FossilType;
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
    image_url: { type: DataTypes.STRING(500), allowNull: true },
    discovery_date: { type: DataTypes.DATE, allowNull: true },
    location: { type: DataTypes.STRING(255), allowNull: true },
    paleontologist: { type: DataTypes.STRING(255), allowNull: true },
    fossil_type: {
      type: DataTypes.ENUM(
        "bones_teeth",
        "shell_exoskeletons",
        "plant_impressions",
        "tracks_traces",
        "amber_insects"
      ),
      allowNull: false,
      defaultValue: "bones_teeth",
    },
    geological_period: { type: DataTypes.STRING(100), allowNull: true },
    author_id: { type: DataTypes.BIGINT, allowNull: false },
    status: {
      type: DataTypes.ENUM("draft", "published"),
      allowNull: false,
      defaultValue: "draft",
    },
    source: { type: DataTypes.STRING(500), allowNull: true },
  },
  {
    sequelize,
    tableName: "fossils",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Fossil;
