const express = require('express');
const router = express.Router();
const CharactersController = require('../Controllers/charactersController');
router.get('/universes/:id/characters',CharactersController.getCharactersById);
router.put('/universes/:univerId/characters/:charactersId',CharactersController.updateCharactersById);
router.delete('/universes/:univerId/characters/:charactersId',CharactersController.deleteCharacterById);
router.post('/universes/:id/characters',CharactersController.createCharacter);
module.exports = router;