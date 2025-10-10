import { Model, Optional } from 'sequelize';
export interface UserAttributes {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    role: 'admin' | 'user';
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
}
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> {
}
export declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    role: 'admin' | 'user';
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export interface CreateUserDTO {
    username: string;
    email: string;
    password: string;
    role?: 'admin' | 'user';
}
export interface LoginDTO {
    email: string;
    password: string;
}
export interface UserResponse {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'user';
    created_at: Date;
}
export interface AuthResponse {
    user: UserResponse;
    token: string;
}
export {};
//# sourceMappingURL=User.d.ts.map