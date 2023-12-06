const express = require('express');
const router = express.Router();
const messageController = require('../Controllers/messagesController');
router.post("/conversations/:conversationId/messages",messageController.newMessage);
router.get('/conversations/:conversationId/messages',messageController.getMessagesById);
router.put('/conversations/:conversationId',messageController.regenerateAssistantMessage);
module.exports=router;