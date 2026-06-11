const getConnection = require('./db');
const path = require('path');
const queries = require('./queries');

module.exports = {
  async getMenus() {
    return await queries.getAllMenus();
  },

  async save(fields, files){
    let query, queryPhoto = '', params = [
      fields.title,
      fields.description,
      fields.price
    ];
    
    const hasPhoto = files.photo && files.photo.size > 0;
    
    if(hasPhoto){
      const photoFilePath = files.photo.filepath;
      fields.photo = `images/${path.parse(photoFilePath).base}`;
      queryPhoto = ',photo = ?';
      params.push(fields.photo);
    }

    if(parseInt(fields.id) > 0) {
      params.push(fields.id);
      query = `
        UPDATE tb_menus
        SET title = ?,
          description = ?,
          price = ?
          ${queryPhoto}
        WHERE id = ?
      `;
    } else {

      if (!hasPhoto && !fields.photo){
        throw new Error('Envie a foto do prato.');
      }
      query = `
        INSERT INTO tb_menus (title, description, price, photo)
        VALUES(?, ?, ?, ?)
      `;
      params.push(fields.photo);
    }
    
    const conn = await getConnection();
    const [results] = await conn.query(query, params);
    
    return results;
  },

  async delete(id){
    try {
        const conn = await getConnection();
        const [results] = await conn.query(`
          DELETE FROM tb_menus WHERE id = ?
        `, [id]);
        return results;
      } catch (err) {
          throw new Error(`Erro ao deletar produto: ${err.message}`);
      }
  }
};
