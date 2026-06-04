const getConnection = require('./../inc/db');
const express = require('express');
const router = express.Router();

router.get('/', async function(req, res, next) {
  try {
    const conn = await getConnection();
    const [results] = await conn.query("SELECT * FROM tb_users ORDER BY name");
    res.send(results);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
