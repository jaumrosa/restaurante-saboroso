
const getConnection = require('./db');
module.exports = {

    render(req, res, error, success){
        res.render('contacts', {
        title: 'Contato - Restaurante Saboroso!',
        background: 'images/img_bg_3.jpg',
        h1: 'Diga um oi!',
        body: req.body,
        error,
        success
        });
    },

    async save(fields){
        const conn = await getConnection();
        const [results] = await conn.query(`
        INSERT INTO tb_contacts (name, email, message)
        VALUES(?, ?, ?)
        `, [
            fields.name,
            fields.email,
            fields.message
        ]);

        return results;
    },

    async getContacts() {
        const conn = await getConnection();
        const [results] = await conn.query(`SELECT * FROM tb_contacts ORDER BY register DESC`);
        return results;
    },

    async delete(id){
        try {
            const conn = await getConnection();
            const [results] = await conn.query(`
            DELETE FROM tb_contacts WHERE id = ?
            `, [id]);
            return results;
        } catch (err) {
            throw new Error(`Erro ao deletar contato: ${err.message}`);
        }
    }


}