var express = require('express');
var controller = require('./cart.controller');
var router = express.Router();

router.post('/', controller.add);
router.get('/', controller.getAll);
router.post('/user', controller.getAUsers);
router.post('/paid', controller.getPaid);
router.post('/add', controller.addItem);
router.delete('/:id', controller.deleteItem);
router.post('/pay', controller.checkout);
router.post('/card', controller.cardpay);
router.post('/confirmPay', controller.checkTransaction);
router.post('/updatestatus', controller.changeStatus);
router.get('/payments', controller.getPayments);
router.post('/paymentsbyuser', controller.getUsersPayments);
router.post('/updatePaidStatus', controller.updatePaidStatus);

module.exports = router;