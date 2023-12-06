const express = require('express');
const router = express.Router();
const UniversController = require('../Controllers/universController');
router.get('/universes',UniversController.getAllUnivers);
router.post('/universes',UniversController.createUniver);
router.put('/universes/:id',UniversController.updateUniverById);
router.get('/universes/:id',UniversController.getUniverById);
router.delete('/universes/:universeId',UniversController.deleteUniverseById);
module.exports = router;