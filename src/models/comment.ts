// src/models/Comment.ts
/**
 * MODELO COMMENT - Sequelize-TypeScript con Decoradores
 */

import 'reflect-metadata';
import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    DataType,
    ForeignKey,
    BelongsTo,
    Comment as SqComment,
} from 'sequelize-typescript';

// ============================================
// TIPOS E INTERFACES
// ============================================

export interface CommentAttributes {
    id: number;
    post_id: number;
    user_id: number;
    content: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
}

// ✅ Tipo para creación (sin id ni timestamps)
export interface CommentCreationAttributes {
    post_id: number;
    user_id: number;
    content: string;
}

// ============================================
// MODELO COMMENT CON DECORADORES
// ============================================

@Table({
    tableName: 'comments',
    modelName: 'Comment',
    timestamps: true,
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    indexes: [
        { name: 'idx_comments_post_id', fields: ['post_id'] },
        { name: 'idx_comments_user_id', fields: ['user_id'] },
        { name: 'idx_comments_created_at', fields: ['created_at'] }
    ]
})
export class Comment extends Model<CommentAttributes, CommentCreationAttributes> {

    // ============================================
    // COLUMNAS
    // ============================================

    @SqComment('Identificador único del comentario')
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT.UNSIGNED) // 👈 CAMBIADO de INTEGER a BIGINT
    public id!: number;

    @SqComment('ID del post al que pertenece el comentario')
    @AllowNull(false)
    @ForeignKey(() => require('./GobModelPost').default)
    @Column(DataType.BIGINT.UNSIGNED) // 👈 CAMBIADO de INTEGER a BIGINT
    public post_id!: number;

    @SqComment('ID del usuario que hizo el comentario')
    @AllowNull(false)
    @ForeignKey(() => require('./User').User)
    @Column(DataType.BIGINT.UNSIGNED) // 👈 CAMBIADO de INTEGER a BIGINT
    public user_id!: number;

    @SqComment('Contenido del comentario')
    @AllowNull(false)
    @Column({
        type: DataType.TEXT,
        validate: {
            notEmpty: {
                msg: 'El contenido no puede estar vacío'
            },
            len: {
                args: [1, 5000],
                msg: 'El comentario debe tener entre 1 y 5000 caracteres'
            }
        }
    })
    public content!: string;

    // ============================================
    // TIMESTAMPS (readonly)
    // ============================================

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    public readonly deleted_at!: Date | null;

    // ============================================
    // RELACIONES (LAZY LOADING)
    // ============================================

    @BelongsTo(() => require('./GobModelPost').default, {
        foreignKey: 'post_id',
        as: 'post'
    })
    public post?: any;

    @BelongsTo(() => require('./User').User, {
        foreignKey: 'user_id',
        as: 'author'
    })
    public author?: any;
}

export default Comment;
