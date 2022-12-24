const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const validations = require('./validations');
const rendezVousController = require('./index');

const router = express.Router();

router.post(
  '/get-rendezvous/:rendezVousId',
  auth(),
  validate(validations.getRendezVousById),
  rendezVousController.getRendezVousById
);
router.post('/create-rendezvous', auth(), validate(validations.createRendezVous), rendezVousController.createRendezVous);
router.put(
  '/delete-all-rendezvous/:userId',
  auth(),
  validate(validations.deleteAllRendezVous),
  rendezVousController.deleteAllRendezVous
);
router.get('/all-rendezvous', auth(), rendezVousController.getAllRendezVous);
router.post(
  '/all-rendezvous/type/:type',
  auth(),
  validate(validations.getAllRendezVousPerType),
  rendezVousController.getAllRendezVousPerType
);
router.get('/last-rendezvous', rendezVousController.getLastRendezVous);

module.exports = router;
