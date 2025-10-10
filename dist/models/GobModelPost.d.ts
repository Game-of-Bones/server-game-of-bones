import { Model, Optional } from "sequelize";
export type FossilType = "bones_teeth" | "shell_exoskeletons" | "plant_impressions" | "tracks_traces" | "amber_insects";
export type Status = "draft" | "published";
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
interface FossilCreationAttributes extends Optional<FossilAttributes, "id" | "image_url" | "discovery_date" | "location" | "paleontologist" | "geological_period" | "status" | "source" | "deletedAt"> {
}
declare class Fossil extends Model<FossilAttributes, FossilCreationAttributes> implements FossilAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;
}
export default Fossil;
//# sourceMappingURL=GobModelPost.d.ts.map