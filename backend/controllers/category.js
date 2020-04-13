const { check, validationResult } = require("express-validator");

const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }
    req.category = cate;
    next();
  });
};

exports.createCategory = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array()[0].msg });
  }

  const category = new Category(req.body);

  category.save((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "Unable to save category in DB",
      });
    }
    res.json(cate);
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategories = (req, res) => {
  Category.find({}).exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "No category/ies found in DB",
      });
    }

    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array()[0].msg });
  }

  category.name = req.body.name;

  category.save((err, updatedCate) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to update category in DB",
      });
    }
    res.json(updatedCate);
  });
};

exports.deleteCategory = (req, res) => {
  const category = req.category;

  category.remove((err, deletedCate) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete category from DB",
      });
    }
    res.json({
      message: `Successfully deleted category: ${deletedCate.name}`,
    });
  });
};
