"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database/database")); // Ajusta si tu path es diferente
class Fossil extends sequelize_1.Model {
}
Fossil.init({
    id: { type: sequelize_1.DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    summary: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    image_url: { type: sequelize_1.DataTypes.STRING(500), allowNull: true },
    discovery_date: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    location: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
    paleontologist: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
    fossil_type: {
        type: sequelize_1.DataTypes.ENUM("bones_teeth", "shell_exoskeletons", "plant_impressions", "tracks_traces", "amber_insects"),
        allowNull: false,
        defaultValue: "bones_teeth",
    },
    geological_period: { type: sequelize_1.DataTypes.STRING(100), allowNull: true },
    author_id: { type: sequelize_1.DataTypes.BIGINT, allowNull: false },
    status: {
        type: sequelize_1.DataTypes.ENUM("draft", "published"),
        allowNull: false,
        defaultValue: "draft",
    },
    source: { type: sequelize_1.DataTypes.STRING(500), allowNull: true },
}, {
    sequelize: database_1.default,
    tableName: "fossils",
    timestamps: true,
    paranoid: true,
    underscored: true,
});
exports.default = Fossil;
//# sourceMappingURL=GobModelPost.js.map