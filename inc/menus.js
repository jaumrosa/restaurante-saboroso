const getConnection = require('./db');

module.exports = {
  async getMenus() {
    const conn = await getConnection();
    const [results] = await conn.query(`SELECT * FROM tb_menus ORDER BY title`);
    return results;
  }
};
