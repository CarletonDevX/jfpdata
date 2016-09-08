'use strict';

module.exports = function(app) {
  return function(req, res, next) {
    app.service('jobs').create(req.body).then(job => {
      res.send(job);
    }).catch(err => next(err));
  };
};
