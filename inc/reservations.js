const getConnection = require('./db');

module.exports = {
  render(req, res, error, success) {
    res.render('reservations', {
      title: 'Reservas - Restaurante Saboroso!',
      background: 'images/img_bg_2.jpg',
      h1: 'Reserve uma Mesa!',
      body: req.body,
      error,
      success
    });
  },

  async save(fields) {
    const date = fields.date.split('/');
    fields.date = `${date[2]}-${date[1]}-${date[0]}`
    const conn = await getConnection();
    const [results] = await conn.query(`
      INSERT INTO tb_reservations (name, email, people, date, time)
      VALUES(?, ?, ?, ?, ?)
    `, [
      fields.name,
      fields.email,
      fields.people,
      fields.date,
      fields.time
    ]);
    
    return results;
  }
};
