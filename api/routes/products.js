const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const date = new Date().toISOString();
    const nameId = date.replace(/[:.-]/g, "");
    cb(null, nameId + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type uploaded"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const ProductController = require("../controllers/products");

router.get("/", ProductController.getAllProducts);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductController.createProduct
);

router.get("/:productId", ProductController.getProduct);

router.patch("/:productId", checkAuth, ProductController.patchProduct);

router.delete("/:productId", checkAuth, ProductController.deleteProduct);

module.exports = router;
