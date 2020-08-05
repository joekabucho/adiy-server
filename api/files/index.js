const controller = require('./file.controller');
var express = require('express');
var router = express.Router();

router.post('/', controller.upload);
router.get('/', controller.getAll);
router.get('/:user', controller.getOne);
router.post('/user', controller.getUsers);
router.post('/fb', controller.fbpost);
router.get('/html', controller.tohtml);
router.delete('/delete/:id', controller.delete);

module.exports = router;


