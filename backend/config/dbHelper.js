// Helper para adaptar consultas MySQL a SQLite
const db = require('./database');

// Wrapper para mantener compatibilidad con código MySQL
const dbHelper = {
    async query(sql, params = []) {
        try {
            // Convertir ? placeholders (están bien para SQLite)
            const [rows] = await db.query(sql, params);
            
            // Si es un INSERT, devolver el lastID
            if (sql.trim().toUpperCase().startsWith('INSERT')) {
                return [{ insertId: rows.lastInsertRowid, affectedRows: rows.changes }, null];
            }
            
            // Si es UPDATE o DELETE
            if (sql.trim().toUpperCase().startsWith('UPDATE') || 
                sql.trim().toUpperCase().startsWith('DELETE')) {
                return [{ affectedRows: rows.changes }, null];
            }
            
            // Si es SELECT, devolver array de resultados
            return [rows, null];
        } catch (error) {
            console.error('Database error:', error);
            throw error;
        }
    }
};

module.exports = dbHelper;
