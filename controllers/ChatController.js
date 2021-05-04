const { Router } = require('express');
// const Messages = require('../models/Messages');

const router = Router();

router.get('/', async (request, response) => {
  return response.status(200).render('chat');
});

module.exports = router;
