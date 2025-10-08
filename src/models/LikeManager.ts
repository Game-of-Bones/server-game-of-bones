// import { OkPacket, RowDataPacket } from "mysql2";
// import AbstractManager from "./AbstractManager";
// import { Like } from "./Like";

// interface LikeCount extends RowDataPacket {
//   like_count: number;
// }

// export default class LikeManager extends AbstractManager {
//   constructor() {
//     // Llama al constructor de la clase padre (AbstractManager)
//     // y le pasa el nombre de la tabla "likes" como parámetro.
//     super({ table: "likes" });
//   }

//   /**
//    * Añade un nuevo "like" a la base de datos.
//    * @param like Un objeto con user_id y post_id.
//    * @returns El ID del "like" recién insertado.
//    */
//   async add(like: { user_id: number; post_id: number }): Promise<number> {
//     const [result] = await this.database.query<OkPacket>(
//       `INSERT INTO ${this.table} (user_id, post_id) VALUES (?, ?)`,
//       [like.user_id, like.post_id]
//     );

//     return result.insertId;
//   }

//   /**
//    * Elimina un "like" de la base de datos.
//    * @param like Un objeto con user_id y post_id.
//    * @returns El número de filas afectadas (debería ser 1 si tiene éxito).
//    */
//   async delete(like: { user_id: number; post_id: number }): Promise<number> {
//     const [result] = await this.database.query<OkPacket>(
//       `DELETE FROM ${this.table} WHERE user_id = ? AND post_id = ?`,
//       [like.user_id, like.post_id]
//     );

//     return result.affectedRows;
//   }

//   /**
//    * Obtiene el número total de "likes" para una publicación específica.
//    * @param postId El ID de la publicación.
//    * @returns El número total de "likes".
//    */
//   async findCountByPostId(postId: number): Promise<number> {
//     const [rows] = await this.database.query<LikeCount[]>(
//       `SELECT COUNT(*) AS like_count FROM ${this.table} WHERE post_id = ?`,
//       [postId]
//     );

//     return rows[0].like_count;
//   }

//   /**
//    * Comprueba si un usuario específico ya ha dado "like" a una publicación.
//    * @param userId El ID del usuario.
//    * @param postId El ID de la publicación.
//    * @returns El objeto "like" si existe, si no, null.
//    */
//   async findUserLikeForPost(userId: number, postId: number): Promise<Like | null> {
//     const [rows] = await this.database.query<Like[] & RowDataPacket[]>(
//       `SELECT * FROM ${this.table} WHERE user_id = ? AND post_id = ?`,
//       [userId, postId]
//     );

//     return rows[0] || null;
//   }
// }
