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

router.get('/contacts', function(req, res, next){
  res.render('contacts', {
    title: 'Contato - Restaurante Saboroso!',
    background: 'images/img_bg_3.jpg',
    h1: 'Diga um oi!'
  });
});

router.get('/menus', function(req, res, next){
  res.render('menus', {
    title: 'Menu - Restaurante Saboroso!',
    background: 'images/img_bg_1.jpg',
    h1: 'Saboreie nosso menu!'
  });
});

router.get('/reservations', function(req, res, next){
  res.render('reservations', {
    title: 'Reservas - Restaurante Saboroso!',
    background: 'images/img_bg_2.jpg',
    h1: 'Reserve uma Mesa!'
  })
});

router.get('/services', function(req, res, next){
  res.render('services', {
    title: 'Serviços - Restaurante Saboroso!',
    background: 'images/img_bg_1.jpg',
    h1: 'É um prazer poder servir!'
  })
});


module.exports = router;
