const getConnection = require('./db');
const path = require('path');

module.exports = {
  async getMenus() {
    const conn = await getConnection();
    const [results] = await conn.query(`SELECT * FROM tb_menus ORDER BY title`);
    return results;
  },

  async save(fields, files){
    const photoFilePath = files.photo.filepath;
    fields.photo = `images/${path.parse(photoFilePath).base}`;
    const conn = await getConnection();
    const [results] = await conn.query(`
      INSERT INTO tb_menus (title, description, price, photo)
      VALUES(?, ?, ?, ?)
    `, [
      fields.title,
      fields.description,
      fields.price,
      fields.photo
    ]);
    
    return results;
  }
};
