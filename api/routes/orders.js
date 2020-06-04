const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const checkAuth = require('../middleware/check-auth')
const OrdersController = require('../controllers/orders')

router.get("/", checkAuth, OrdersController.getAllOrders);

router.get("/:orderId", checkAuth, OrdersController.getSpesOrder);

router.post("/", checkAuth, OrdersController.createOrder);

router.delete("/:orderId", checkAuth, OrdersController.deleteOrder);

module.exports = router;
