// Create web server application
var express = require('express');
var router = express.Router();

// Import comment model
var Comment = require('../models/comment');

// Import post model
var Post = require('../models/post');

// Import user model
var User = require('../models/user');

// Import auth middleware
var auth = require('../middlewares/auth');

// Import config
var config = require('../config');

// Import utils
var utils = require('../utils');

// Import validator
var validator = require('validator');

// Import async
var async = require('async');

// Import moment
var moment = require('moment');

// Import fs
var fs = require('fs');

// Import path
var path = require('path');

// Import sanitize-html
var sanitizeHtml = require('sanitize-html');

// Import multer
var multer = require('multer');

// Import upload
var upload = multer({ dest: 'public/uploads/' });

// Import cloudinary
var cloudinary = require('cloudinary');

// Import cloudinary config
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret
});

// GET /comments
router.get('/', auth.requireLogin, function(req, res, next) {
  // Find all comments
  Comment.find({})
    .populate('author post')
    .exec(function(err, comments) {
      if (err) {
        return next(err);
      }

      // Render comments index page
      res.render('comments/index', { comments: comments });
    });
});

// GET /comments/new
router.get('/new', auth.requireLogin, function(req, res, next) {
  // Find all posts
  Post.find({})
    .populate('author')
    .exec(function(err, posts) {
      if (err) {
        return next(err);
      }

      // Render comments new page
      res.render('comments/new', { posts: posts });
    });
});

// POST /comments
router.post('/', auth.requireLogin, function(req, res, next) {
  // Find a post
  Post.findById(req.body.post, function(err, post) {
    if (err) {
      return next(err);
    }

    // Create a comment
    Comment.create({