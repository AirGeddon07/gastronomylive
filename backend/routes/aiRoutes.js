import express from 'express';
import { chatWithAI } from '../controllers/aiController.js';

const router = express.Router();

// When the frontend sends a POST request to /chat, run the chatWithAI function
router.post('/chat', chatWithAI);

export default router;