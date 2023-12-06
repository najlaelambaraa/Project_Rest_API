const express = require('express');
const router = express.Router();
const messageController = require('../Controllers/messagesController');
router.post("/conversations/:conversationId/messages",messageController.newMessage);
router.get('/conversations/:conversationId/messages',messageController.getMessagesById);
module.exports=router;