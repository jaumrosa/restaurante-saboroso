const { dashboard } = require('./admin');
const getConnection = require('./db');
const Pagination = require('./Pagination');
const moment = require('moment');

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
    },

    async chart(req){
      const conn = await getConnection();
      const [results] = await conn.query(`
        SELECT
          YEAR(date) AS year,
          MONTH(date) AS month,
          COUNT(*) AS total,
          ROUND(SUM(people) / COUNT(*), 2) AS avg_people 
        FROM tb_reservations
        WHERE
          date BETWEEN ? AND ?
        GROUP BY YEAR(date), MONTH(date)
        ORDER BY YEAR(date) DESC, MONTH(date) DESC
      `, [
        req.query.start,
        req.query.end
      ]);

      const months = [];
      const values = [];

      results.forEach(row => {
        // Criar data do primeiro dia do mês para formatar
        const dateStr = `${row.year}-${String(row.month).padStart(2, '0')}-01`;
        months.push(moment(dateStr).format('MMM YYYY'));
        values.push(row.total);
      });

      return {
        months,
        values
      };
    },

    async dashboard() {
      const conn = await getConnection();
      const [results] = await conn.query(`
              SELECT
                  (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
                  (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
                  (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
                  (SELECT COUNT(*) FROM tb_users) AS nrusers;    
          `)
      return results[0];
    }
  }
