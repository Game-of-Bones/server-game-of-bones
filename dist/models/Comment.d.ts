import { Model, Optional } from 'sequelize';
export interface CommentAttributes {
    id: number;
    post_id: number;
    user_id: number;
    content: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
}
export interface CommentCreationAttributes extends Optional<CommentAttributes, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> {
}
export declare class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
    id: number;
    post_id: number;
    user_id: number;
    content: string;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date | null;
}
//# sourceMappingURL=Comment.d.ts.map