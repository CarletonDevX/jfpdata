'use strict';

const service = require('feathers-mongoose');
const jobs = require('./jobs-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: jobs,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/jobs', service(options));

  // Get our initialize service to that we can bind hooks
  const jobsService = app.service('/jobs');

  // Set up our before hooks
  jobsService.before(hooks.before);

  // Set up our after hooks
  jobsService.after(hooks.after);
};
