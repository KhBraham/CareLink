import express from 'express';
import { handleChatMessage } from '../controllers/chatbot.controller';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, handleChatMessage);

export default router;
