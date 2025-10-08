// Interfaces temporales para satisfacer el compilador (Tu compañera debe definir las reales)
interface OkPacket {
    affectedRows: number;
    insertId: number;
}
interface RowDataPacket {
    [column: string]: any;
}
type QueryResult<T> = [T, any]; // Formato esperado por desestructuración: [results, fields]


const database = {
    /**
     * Placeholder para un método de consulta raw.
     * Retorna un resultado desestructurable [rows, fields] para satisfacer la sintaxis de LikeManager.ts.
     */
    query: async <T extends RowDataPacket | OkPacket[] | any>(sql: string, params?: any[]): Promise<QueryResult<T>> => {
        console.warn("⚠️ Usando Database Client PLACEHOLDER. La consulta no se ejecutará.");
        
        // Simula la desestructuración [result, fields]
        // T debe ser un array para desestructurar `const [rows]` en LikeManager.ts
        if (sql.toLowerCase().startsWith('select')) {
            return [[] as unknown as T, []];
        } else {
            // Simula OkPacket para INSERT/UPDATE/DELETE
            const mockOkPacket: OkPacket = { affectedRows: 1, insertId: 999 };
            return [[mockOkPacket] as unknown as T, []];
        }
    },

    /**
     * Placeholder para un método de ejecución de comando (INSERT, UPDATE, DELETE).
     */
    execute: (sql: string, params?: any[]) => {
        console.warn("⚠️ Usando Database Client PLACEHOLDER. La ejecución no se completará.");
        return Promise.resolve({ rowCount: 0 });
    },

    // Puedes añadir cualquier otra propiedad que AbstractManager pueda necesitar, por ejemplo:
    connectionStatus: 'placeholder_connected',
};

export default database;