import { Model, Optional } from 'sequelize';
export interface LikeAttributes {
    id: number;
    user_id: number;
    post_id: number;
    created_at?: Date;
}
export interface LikeCreationAttributes extends Optional<LikeAttributes, 'id' | 'created_at'> {
}
export declare class Like extends Model<LikeAttributes, LikeCreationAttributes> implements LikeAttributes {
    id: number;
    user_id: number;
    post_id: number;
    readonly created_at: Date;
}
export { Like };
export default Like;
//# sourceMappingURL=Like.d.ts.map