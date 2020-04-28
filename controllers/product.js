const { body, validationResult } = require("express-validator");

const Product = require("../models/product");

const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with image",
      });
    }

    // Destructuring the fields
    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let product = new Product(fields);

    // Handle file
    if (file.photo) {
      if (file.photo.size > 3145728) {
        // 3145728 bytes = 3MB
        return res.status(400).json({
          error: "Image size is too big",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // Save product in DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save product in DB",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

// Middleware to load/send photo in background
exports.getPhoto = (req, res, next) => {
  if (req.product.photo.data) {
    // Set Content-Type to load photo of that type
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with image",
      });
    }

    // Updation Code
    let product = req.product;
    product = _.extend(product, fields);

    // Handle file
    if (file.photo) {
      if (file.photo.size > 3145728) {
        // 3145728 bytes = 3MB
        return res.status(400).json({
          error: "Image size is too big",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // Save product in DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Failed to update product in DB",
        });
      }
      res.json(product);
    });
  });
};

exports.deleteProduct = (req, res) => {
  const product = req.product;

  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete product from DB",
      });
    }
    res.json({
      message: `Successfully deleted product: ${deletedProduct.name}`,
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  //   console.log(limit);
  //   console.log(sortBy);

  Product.find()
    .select("-photo") // Don't retreive photo field
    .populate("category") // If not then it only retreive categortId
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No product/s found in DB",
        });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "No category/ies found in DB",
      });
    }
    res.json(category);
  });
};

exports.updateStock = (req, res, next) => {
  let myOperation = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });
  Product.bulkWrite(myOperation, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed",
      });
    }
    next();
  });
};
