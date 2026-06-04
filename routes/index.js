const getConnection = require('./../inc/db');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const conn = await getConnection();  // ← CHAMA a função
    const [results] = await conn.query(`SELECT * FROM tb_menus ORDER BY title`);
    
    res.render('index', { 
      title: 'Restaurante Saboroso!',
      menus: results 
    });
  } catch(err) {
    console.log(err);
    res.status(500).send('Erro ao carregar o menu');
  }
});

module.exports = router;
