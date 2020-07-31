var express = require('express');
var controller = require('./allArtWorks.controller');
var router = express.Router();

router.post('/', controller.add);
router.get('/', controller.getAll);

router.delete('/:id', controller.deleteItem);
router.get('/:fileId', controller.getOne);


module.exports = router;
