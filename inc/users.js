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
    },

    async getUsers() {
        const conn = await getConnection();
        const [results] = await conn.query(`SELECT * FROM tb_users ORDER BY name`);
        return results;
  },

    async save(fields){
        let query, params = [
        fields.name,
        fields.email
        ];
    

        if(parseInt(fields.id) > 0) {
            params.push(fields.id);
            query = `
                UPDATE tb_users
                SET name = ?,
                    email = ?
                WHERE id = ?
            `;
        } else {
            query = `
                INSERT INTO tb_users (name, email, password)
                VALUES(?, ?, ?)
            `;

            params.push(fields.password);
     
        }
        
        const conn = await getConnection();
        const [results] = await conn.query(query, params);
        
        return results;
    },

  async delete(id){
    try {
        const conn = await getConnection();
        const [results] = await conn.query(`
          DELETE FROM tb_users WHERE id = ?
        `, [id]);
        return results;
      } catch (err) {
          throw new Error(`Erro ao deletar o usuário: ${err.message}`);
      }
  }
}