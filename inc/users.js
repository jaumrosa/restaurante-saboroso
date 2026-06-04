const getConnection = require('./db');
module.exports = {

    render(req, res, error){
        res.render("admin/login", {
            body: req.body,
            error
        });
    },

    async login(email, password){
        const conn = await getConnection();
        const [results] = await conn.query(`
        SELECT * FROM tb_users WHERE email = ?
        `, [email]);
        
        if (results.length === 0) {
            throw new Error("Usuário ou senha incorretos.");
        }
        
        const row = results[0];
        
        // Verificar senha
        if (row.password !== password) {
            throw new Error("Usuário ou senha incorretos.");
        }

        return row;
    }
}