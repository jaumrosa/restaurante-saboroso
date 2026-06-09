
const getConnection = require('./db');
module.exports = {

    async getEmails() {
        const conn = await getConnection();
        const [results] = await conn.query(`SELECT * FROM tb_emails ORDER BY register DESC`);
        return results;
    },

    async delete(id){
        try {
            const conn = await getConnection();
            const [results] = await conn.query(`
            DELETE FROM tb_emails WHERE id = ?
            `, [id]);
            return results;
        } catch (err) {
            throw new Error(`Erro ao deletar email: ${err.message}`);
        }
    },

    async save(req) {
        if(!req.fields.email){
            throw new Error("Preencha o E-mail.");
        } else {
            const conn = await getConnection();
            const [results] = await conn.query(`
            INSERT INTO tb_emails (email) VALUES(?)
            `,[req.fields.email]);
             return results;
        }
    }
}