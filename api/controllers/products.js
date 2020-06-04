const Product = require("../models/product");
const mongoose = require("mongoose");

exports.getAllProducts = (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            id: doc._id,
            productImage: doc.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
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

exports.createProduct = (req, res, next) => {
  console.log("FILE:", req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  product
    .save()
    .then((result) => {
      const response = {
        name: result.name,
        price: result.price,
        id: result._id,
        productImage: result.productImage,
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + result._id,
        },
      };
      res.status(201).json({
        message: "Created product",
        Createdproduct: response,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
    .then((doc) => {
      console.log("Document from DB", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            description: "Get All products",
            url: "http://localhost:3000/products",
          },
        });
      } else {
        const err = new Error("No valid entry found for provided ID");
        res.status(404).json({
          error: err.message,
          request: {
            type: "GET",
            description: "Get all products",
            url: "http://localhost:3000/products",
          },
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.patchProduct = (req, res, next) => {
  const id = req.params.productId;
  const updatedOps = {};
  for (const ops of req.body) {
    updatedOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updatedOps })
    .then((result) => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.deleteProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .then(
      res.status(200).json({
        message: "Product removed",
        request: {
          type: "GET",
          url: "http://localhost/products",
        },
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
