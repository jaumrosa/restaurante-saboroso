
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
    }
}