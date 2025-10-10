import { Model, DataTypes, Optional } from 'sequelize';
// Importamos los decoradores, usando alias (SqComment) para evitar la colisión de nombres
import { 
    Table, Column, PrimaryKey, AutoIncrement, 
    AllowNull, Index, 
    Comment as SqComment, // <-- Alias para el decorador Comment
    // Eliminamos importaciones no utilizadas como Default, Unique, BelongsTo, HasMany, ForeignKey
} from 'sequelize-typescript'; 
import sequelize from '../database/database'; 

// IMPORTANTE: Necesario para que los decoradores funcionen correctamente
import 'reflect-metadata'; 

// --- 1. Definición de Tipos ---

// Atributos que existen en la tabla SQL
export interface CommentAttributes {
    id: number;            
    post_id: number;       
    user_id: number;       
    content: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
}

// Atributos para la creación
export interface CommentCreationAttributes extends Optional<CommentAttributes, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> {}

// --- 2. Implementación del Modelo con Decoradores ---

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
    
    // Los índices se definen dentro de @Table
    indexes: [
        { name: 'idx_comments_post_id', fields: ['post_id'] },
        { name: 'idx_comments_user_id', fields: ['user_id'] },
        { name: 'idx_comments_created_at', fields: ['created_at'] }
    ]
})
export class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
    
    // Usamos @SqComment para evitar el conflicto
    @SqComment('Identificador único del comentario')
    @PrimaryKey
    @AutoIncrement
    // Pasamos la definición del tipo dentro del objeto de configuración de @Column
    @Column({
        type: DataTypes.INTEGER.UNSIGNED,
    })
    public id!: number;

    @SqComment('ID del post al que pertenece el comentario')
    @AllowNull(false)
    @Column({
        type: DataTypes.INTEGER.UNSIGNED,
    })
    public post_id!: number;

    @SqComment('ID del usuario que hizo el comentario')
    @AllowNull(false)
    @Column({
        type: DataTypes.INTEGER.UNSIGNED,
    })
    public user_id!: number;

    @SqComment('Contenido del comentario')
    @AllowNull(false)
    // Se definen las validaciones directamente en el objeto de configuración de @Column
    @Column({
        type: DataTypes.TEXT,
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

    // Timestamps
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    public readonly deleted_at!: Date | null;
}
// NOTA: EL BLOQUE Comment.init() NO DEBE EXISTIR EN ESTE ARCHIVO