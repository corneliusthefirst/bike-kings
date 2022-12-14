/* eslint-disable no-console */
const httpStatus = require('http-status');

const rendezVousService = require('../../services/rendezvous.service');
const catchAsync = require('../../utils/catchAsync');

module.exports = catchAsync(async (req, res) => {
  const rendezvous = await rendezVousService.createRendezVous(req.user, req.body);

  res.status(httpStatus.CREATED).send(rendezvous);
});
