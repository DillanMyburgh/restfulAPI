const Order = require("../models/order");
const Product = require("../models/product");

exports.getAllOrders = (req, res, next) => {
  Order.find()
    .populate("product", "name price")
    .select("id product quantity")
    .then((docs) => {
      const response = {
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            quantity: doc.quantity,
            product: doc.product,
            request: {
              product: {
                description: "GET product",
                type: "GET",
                url: "http://localhost:3000/products/" + doc.product,
              },
              order: {
                description: "GET order",
                type: "GET",
                url: "http://localhost:3000/orders/" + doc._id,
              },
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.getSpesOrder = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product", "-__v")
    .select("_id quantity product")
    .then((result) => {
      if (!result) {
        err = new Error("Order ID does not exist");
        return (
          res.status(404).json({
            error: err.message,
          }),
          console.log(err)
        );
      }
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.createOrder = (req, res, next) => {
  const { productID, quantity } = req.body;
  Product.findById(productID)
    .then((product) => {
      if (!product) {
        return (
          console.log("Error: invalid product ID"),
          res.status(404).json({
            message: "Product does not exist",
          })
        );
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: productID,
        quantity: quantity,
      });
      return order.save();
    })
    .then((result) => {
      const response = {
        message: "Order created",
        _id: result._id,
        product: result.product,
        quantity: result.quantity,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id,
        },
      };
      res.status(201).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Product not found",
        error: err.message,
      });
    });
};

exports.deleteOrder = (req, res, next) => {
  id = req.params.orderId;
  Order.deleteOne({ _id: id })
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
