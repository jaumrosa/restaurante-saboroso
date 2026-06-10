const getConnection = require('./db');
const bcrypt = require('bcrypt');
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
            throw new Error("Email Incorreto.");
        }
        
        const row = results[0];
        
        // Verificar senha

        const isValid = await bcrypt.compare(password, row.password);
        if (!isValid) {
            throw new Error("Senha incorreta.");
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

            const hashedPassword = await bcrypt.hash(fields.password, 10);
            params.push(hashedPassword);
     
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
  },

  async ChangePassword(req){
    if (!req.fields.password){
        throw new Error('Preencha a senha.');
    } else if (req.fields.password !== req.fields.passwordConfirm) {
        throw new Error('Confirme a senha corretamente.');
    } else {
        try {
            const conn = await getConnection();
            const hashedPassword = await bcrypt.hash(req.fields.password, 10);
            const [results] = await conn.query(`
                UPDATE tb_users
                SET password = ?
                WHERE id = ?
            `, [
                hashedPassword  ,
                req.fields.id
            ]);
            return results;
        } catch (err) {
            throw new Error(`Erro ao alterar a senha: ${err.message}`);
        }
    }

  }
}