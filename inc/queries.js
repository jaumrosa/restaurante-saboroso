const getConnection = require('./db');
module.exports = {

  async getUserByEmail(email) {
    const conn = await getConnection();
    const [results] = await conn.query(`
      SELECT * FROM tb_users WHERE email = ?
    `, [email]);
    return results;
  },

  async getAllUsers() {
    const conn = await getConnection();
    const [results] = await conn.query(`
      SELECT * FROM tb_users ORDER BY name
    `);
    return results;
  },

  async getAllMenus() {
    const conn = await getConnection();
    const [results] = await conn.query(`
      SELECT * FROM tb_menus ORDER BY title
    `);
    return results;
  },

  async getAllContacts() {
    const conn = await getConnection();
    const [results] = await conn.query(`
      SELECT * FROM tb_contacts ORDER BY register DESC
    `);
    return results;
  },

  async getReservationsChart(start, end) {
    const conn = await getConnection();
    const [results] = await conn.query(`
      SELECT
        YEAR(date) AS year,
        MONTH(date) AS month,
        COUNT(*) AS total,
        ROUND(SUM(people) / COUNT(*), 2) AS avg_people 
      FROM tb_reservations
      WHERE date BETWEEN ? AND ?
      GROUP BY YEAR(date), MONTH(date)
      ORDER BY YEAR(date) DESC, MONTH(date) DESC
    `, [start, end]);
    return results;
  },

  async getDashboardStats() {
    const conn = await getConnection();
    const [results] = await conn.query(`
      SELECT
        (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
        (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
        (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
        (SELECT COUNT(*) FROM tb_users) AS nrusers
    `);
    return results[0];
  },

  async countUsers() {
    const conn = await getConnection();
    const [results] = await conn.query(`
      SELECT COUNT(*) AS total FROM tb_users
    `);
    return results[0].total;
  },


};
