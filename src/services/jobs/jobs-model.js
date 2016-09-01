'use strict';

// jobs-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobsSchema = new Schema({
  printer: { type: String, required: true },
  success: { type: Boolean, required: true },
  copies: { type: Number, required: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const jobsModel = mongoose.model('jobs', jobsSchema);

module.exports = jobsModel;
