// // src/models/Comment.ts
// /**
//  * MODELO COMMENT - SEQUELIZE-TYPESCRIPT CON DECORADORES
//  */

// import {
//   Table,
//   Column,
//   Model,
//   DataType,
//   CreatedAt,
//   UpdatedAt,
//   DeletedAt,
//   ForeignKey,
//   BelongsTo,
//   AllowNull,
//   Length
// } from 'sequelize-typescript';

// // ⚠️ NO IMPORTAMOS los modelos relacionados aquí
// // Las relaciones se definen con lazy loading

// // ============================================
// // INTERFACES
// // ============================================

// export interface CommentAttributes {
//   id: number;
//   post_id: number;
//   user_id: number;
//   content: string;
//   created_at?: Date;
//   updated_at?: Date;
//   deleted_at?: Date | null;
// }

// // ============================================
// // MODELO COMMENT CON DECORADORES
// // ============================================

// @Table({
//   tableName: 'comments',
//   timestamps: true,
//   paranoid: true, // Soft delete
//   underscored: true,
//   charset: 'utf8mb4',
//   collate: 'utf8mb4_unicode_ci',
//   indexes: [
//     {
//       name: 'idx_comments_post_id',
//       fields: ['post_id']
//     },
//     {
//       name: 'idx_comments_user_id',
//       fields: ['user_id']
//     },
//     {
//       name: 'idx_comments_created_at',
//       fields: ['created_at']
//     }
//   ]
// })
// export class Comment extends Model<CommentAttributes> {

//   // ============================================
//   // COLUMNAS
//   // ============================================

//   @Column({
//     type: DataType.INTEGER.UNSIGNED,
//     primaryKey: true,
//     autoIncrement: true,
//     comment: 'ID único del comentario'
//   })
//   declare id: number;

//   @ForeignKey(() => require('./GobModelPost').default)
//   @AllowNull(false)
//   @Column({
//     type: DataType.INTEGER.UNSIGNED,
//     comment: 'ID del post al que pertenece'
//   })
//   declare post_id: number;

//   @ForeignKey(() => require('./User').User)
//   @AllowNull(false)
//   @Column({
//     type: DataType.INTEGER.UNSIGNED,
//     comment: 'ID del usuario autor del comentario'
//   })
//   declare user_id: number;

//   @Length({
//     min: 1,
//     max: 5000,
//     msg: 'El comentario debe tener entre 1 y 5000 caracteres'
//   })
//   @AllowNull(false)
//   @Column({
//     type: DataType.TEXT,
//     comment: 'Contenido del comentario'
//   })
//   declare content: string;

//   // ============================================
//   // TIMESTAMPS
//   // ============================================

//   @CreatedAt
//   @Column({
//     type: DataType.DATE,
//     field: 'created_at'
//   })
//   declare created_at: Date;

//   @UpdatedAt
//   @Column({
//     type: DataType.DATE,
//     field: 'updated_at'
//   })
//   declare updated_at: Date;

//   @DeletedAt
//   @Column({
//     type: DataType.DATE,
//     field: 'deleted_at'
//   })
//   declare deleted_at: Date | null;

//   // ============================================
//   // RELACIONES (LAZY LOADING)
//   // ============================================

//   // Cada comentario pertenece a un post
//   @BelongsTo(() => require('./GobModelPost').default, {
//     foreignKey: 'post_id',
//     as: 'post'
//   })
//   declare post?: any;

//   // Cada comentario pertenece a un usuario
//   @BelongsTo(() => require('./User').User, {
//     foreignKey: 'user_id',
//     as: 'author'
//   })
//   declare author?: any;
// }

// export default Comment;
// src/models/Comment.ts
/**
 * MODELO COMMENT - Sequelize-TypeScript con Decoradores
 * Versión híbrida respetando el estilo de tu compañera
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
    @Column(DataType.INTEGER.UNSIGNED)
    public id!: number;

    @SqComment('ID del post al que pertenece el comentario')
    @AllowNull(false)
    @ForeignKey(() => require('./GobModelPost').default)
    @Column(DataType.INTEGER.UNSIGNED)
    public post_id!: number;

    @SqComment('ID del usuario que hizo el comentario')
    @AllowNull(false)
    @ForeignKey(() => require('./User').User)
    @Column(DataType.INTEGER.UNSIGNED)
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
