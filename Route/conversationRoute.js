const express = require('express');
const router = express.Router();
const checkTokenMw = require('../Middleware/checkToken');
const conversationController = require('../Controllers/conversationsController');
router.post('/conversations',conversationController.createConversation);
router.delete('/conversations/:character_id',conversationController.deleteConversationByIdCharactere);
router.get('/conversations',checkTokenMw,conversationController.getConversations);
router.get('/conversations/:conversationId',checkTokenMw,conversationController.getConversationById);

module.exports = router;