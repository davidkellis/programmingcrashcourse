/**
 * REPL API routes
 */

import { Router, Request, Response } from 'express';
import { REPLService } from '../services/replService';
import { REPLError, SessionError } from '../types/services';
import { REPLExecutionRequest, REPLSessionRequest } from '../types/repl';

const router = Router();
const replService = new REPLService();

/**
 * POST /api/repl/sessions
 * Create a new REPL session
 */
router.post('/sessions', async (req: Request, res: Response) => {
  try {
    const { language, userId }: REPLSessionRequest = req.body;

    if (!language) {
      return res.status(400).json({
        success: false,
        error: 'Language is required',
        timestamp: new Date()
      });
    }

    const sessionId = await replService.createSession(language, userId);

    res.status(201).json({
      success: true,
      data: { sessionId, language },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error creating REPL session:', error);

    if (error instanceof REPLError) {
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to create REPL session',
        timestamp: new Date()
      });
    }
  }
});

/**
 * POST /api/repl/execute
 * Execute code in a REPL session
 */
router.post('/execute', async (req: Request, res: Response) => {
  try {
    const { sessionId, code, language }: REPLExecutionRequest = req.body;

    if (!sessionId || !code || !language) {
      return res.status(400).json({
        success: false,
        error: 'sessionId, code, and language are required',
        timestamp: new Date()
      });
    }

    const result = await replService.executeCode(sessionId, code, language);

    res.json({
      success: true,
      data: result,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error executing code:', error);

    if (error instanceof REPLError || error instanceof SessionError) {
      const statusCode = error instanceof SessionError ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error.message,
        sessionId: (error as any).sessionId,
        timestamp: new Date()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Code execution failed',
        timestamp: new Date()
      });
    }
  }
});

/**
 * GET /api/repl/sessions/:sessionId
 * Get session state
 */
router.get('/sessions/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const sessionState = await replService.getSessionState(sessionId);

    res.json({
      success: true,
      data: sessionState,
      timestamp: new Date()
    });
  } catch (error) {
    console.error(`Error getting session state for ${req.params.sessionId}:`, error);

    if (error instanceof SessionError) {
      res.status(404).json({
        success: false,
        error: error.message,
        sessionId: error.sessionId,
        timestamp: new Date()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to get session state',
        timestamp: new Date()
      });
    }
  }
});

/**
 * POST /api/repl/sessions/:sessionId/reset
 * Reset session state
 */
router.post('/sessions/:sessionId/reset', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    await replService.resetSession(sessionId);

    res.json({
      success: true,
      message: 'Session reset successfully',
      timestamp: new Date()
    });
  } catch (error) {
    console.error(`Error resetting session ${req.params.sessionId}:`, error);

    if (error instanceof SessionError) {
      res.status(404).json({
        success: false,
        error: error.message,
        sessionId: error.sessionId,
        timestamp: new Date()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to reset session',
        timestamp: new Date()
      });
    }
  }
});

/**
 * DELETE /api/repl/sessions/:sessionId
 * Delete session
 */
router.delete('/sessions/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    await replService.deleteSession(sessionId);

    res.json({
      success: true,
      message: 'Session deleted successfully',
      timestamp: new Date()
    });
  } catch (error) {
    console.error(`Error deleting session ${req.params.sessionId}:`, error);

    res.status(500).json({
      success: false,
      error: 'Failed to delete session',
      timestamp: new Date()
    });
  }
});

/**
 * GET /api/repl/stats
 * Get REPL service statistics
 */
router.get('/stats', (req: Request, res: Response) => {
  try {
    const stats = replService.getSessionStats();

    res.json({
      success: true,
      data: stats,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting REPL stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get REPL statistics',
      timestamp: new Date()
    });
  }
});

export default router;
