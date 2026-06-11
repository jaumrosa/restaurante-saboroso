const express = require('express');
const router = express.Router();
const menus = require('./../inc/menus');
const reservations = require('./../inc/reservations');
const contacts = require('./../inc/contacts');
const emails = require('./../inc/emails');
const { contactSchema, reservationSchema, validateWithAllErrors } = require('./../inc/validators');

module.exports = function (io){

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
    contacts.render(req, res)
  });

  router.post('/contacts', async function(req, res, next){
    const errorMessage = validateWithAllErrors(contactSchema, req.body);

    if (errorMessage) {
      contacts.render(req, res, errorMessage);
      return;
    }

    try {
      await contacts.save(req.body);
      req.body = {};
      io.emit('dashboard update');
      contacts.render(req, res, null, "Mensagem enviada com sucesso!");
    } catch(err) {
      contacts.render(req, res, err.message);
    }
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

  router.post('/reservations', async function(req, res, next){
    const { error } = reservationSchema.validate(req.body);
     const errorMessage = validateWithAllErrors(reservationSchema, req.body);

  
    if (errorMessage) {
      reservations.render(req, res, errorMessage);
      return;
    }

    try {
      await reservations.save(req.body);
      req.body = {};
      io.emit('dashboard update');
      reservations.render(req, res, null, "Reserva realizada com sucesso!");
    } catch(err) {
      reservations.render(req, res, err.message);
    }
  });

  router.get('/services', function(req, res, next){
    res.render('services', {
      title: 'Serviços - Restaurante Saboroso!',
      background: 'images/img_bg_1.jpg',
      h1: 'É um prazer poder servir!'
    });
  });

  router.post('/subscribe', async function(req, res, next){
    try{
      const results = emails.save(req);
      res.json({
          success: true,
          data: results
      });
    } catch(err) {
        res.status(400).json({
            success: false,
            error: err.message 
        });
      }; 
  });

  return router;
};
