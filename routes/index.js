const express = require('express');
const router = express.Router();
const menus = require('./../inc/menus');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const results = await menus.getMenus();
    res.render('index', { 
      title: 'Restaurante Saboroso!',
      menus: results 
    });
  } catch(err) {
    console.error(err);
    res.status(500).send('Erro ao carregar');
  }
});

router.get('/contacts', function(req, res, next){
  res.render('contacts', {
    title: 'Contato - Restaurante Saboroso!',
    background: 'images/img_bg_3.jpg',
    h1: 'Diga um oi!'
  });
});

router.get('/menus', async function(req, res, next){
  try {
    const results = await menus.getMenus();
    res.render('menus', {
      title: 'Menu - Restaurante Saboroso!',
      background: 'images/img_bg_1.jpg',
      h1: 'Saboreie nosso menu!',
      menus: results
    });
  } catch(err) {
    console.error(err);
    res.status(500).send('Erro ao carregar');
  }
});

router.get('/reservations', function(req, res, next){
  res.render('reservations', {
    title: 'Reservas - Restaurante Saboroso!',
    background: 'images/img_bg_2.jpg',
    h1: 'Reserve uma Mesa!'
  });
});

router.get('/services', function(req, res, next){
  res.render('services', {
    title: 'Serviços - Restaurante Saboroso!',
    background: 'images/img_bg_1.jpg',
    h1: 'É um prazer poder servir!'
  });
});

module.exports = router;
