const getConnection = require('./db');
const Pagination = require('./Pagination');

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
    if (fields.date.indexOf('/') > -1 ){
      const date = fields.date.split('/');
      fields.date = `${date[2]}-${date[1]}-${date[0]}`
    }
    
    let query, params = [
      fields.name,
      fields.email,
      fields.people,
      fields.date,
      fields.time
    ];

    if(parseInt(fields.id) > 0 ){

      query = `
        UPDATE tb_reservations
        SET
          name = ?,
          email = ?,
          people = ?,
          date = ?,
          time = ?
        WHERE id = ?
      `;

      params.push(fields.id);
    } else {
        query = `
          INSERT INTO tb_reservations (name, email, people, date, time)
          VALUES(?, ?, ?, ?, ?)
        `;
    }

    const conn = await getConnection();
    const [results] = await conn.query(query, params);
    
    return results;
  },

  async getReservations(req) {

    let page = parseInt(req.query.page);
    let dtstart = req.query.start;
    let dtend = req.query.end;


    if(!page) page = 1;
    const params = [];
    if (dtstart && dtend){
      params.push(dtstart, dtend);
    }
    const pag = new Pagination(
      `
        SELECT SQL_CALC_FOUND_ROWS * 
        FROM tb_Reservations 
        ${(dtstart && dtend) ? 'WHERE date BETWEEN ? AND ?' : ''}
        ORDER BY name LIMIT ?, ?
      `,
      params
    );
  
    const data = await pag.getPage(page);
    return {
      data,
      links: pag.getNavigation(req.query)
    };
  },

  async delete(id){
    try {
        const conn = await getConnection();
        const [results] = await conn.query(`
          DELETE FROM tb_reservations WHERE id = ?
        `, [id]);
        return results;
      } catch (err) {
          throw new Error(`Erro ao deletar reserva: ${err.message}`);
      }
  }
};
