const express = require('express');
const router = express.Router();
const menus = require('./../inc/menus');
const reservations = require('./../inc/reservations');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const results = await menus.getMenus();
    res.render('index', { 
      title: 'Restaurante Saboroso!',
      menus: results,
      isHome: true
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
  reservations.render(req, res);
});

router.post('/reservations', function(req, res, next){
  if(!req.body.name){
    reservations.render(req, res, "Digite o nome!");
  } else if (!req.body.email){
    reservations.render(req, res, "Digite o E-mail!");
  } else if (!req.body.people){
    reservations.render(req, res, "Selecione o número de pessoas!");
  } else if (!req.body.date){
    reservations.render(req, res, "Selecione a data!");
  } else if (!req.body.time){
    reservations.render(req, res, "Selecione o horário!");
  } else {
    reservations.save(req.body).then(results => {
      req.body = {};
      reservations.render(req, res, null, "Reserva realizada com sucesso!");
    }).catch(err => {
      reservations.render(req, res, err.message);
    })
  }

});

router.get('/services', function(req, res, next){
  res.render('services', {
    title: 'Serviços - Restaurante Saboroso!',
    background: 'images/img_bg_1.jpg',
    h1: 'É um prazer poder servir!'
  });
});

module.exports = router;
