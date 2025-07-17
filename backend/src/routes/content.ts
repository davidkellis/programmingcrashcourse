/**
 * Content API routes
 */

import { Router, Request, Response } from 'express';
import { ContentService } from '../services/contentService';
import { ContentError } from '../types/services';

const router = Router();
const contentService = new ContentService();

/**
 * GET /api/content/languages
 * Get list of supported programming languages
 */
router.get('/languages', async (req: Request, res: Response) => {
  try {
    const languages = await contentService.getSupportedLanguages();
    res.json({
      success: true,
      data: languages,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching languages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch supported languages',
      timestamp: new Date()
    });
  }
});

/**
 * GET /api/content/sections
 * Get all tutorial sections for a specific language
 */
router.get('/sections', async (req: Request, res: Response) => {
  try {
    const language = req.query.language as string || 'python';
    const sections = await contentService.getAllSections(language);

    res.json({
      success: true,
      data: sections,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching sections:', error);

    if (error instanceof ContentError) {
      const statusCode = error.code === 'UNSUPPORTED_LANGUAGE' ? 400 : 404;
      res.status(statusCode).json({
        success: false,
        error: error.message,
        code: error.code,
        timestamp: new Date()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tutorial sections',
        timestamp: new Date()
      });
    }
  }
});

/**
 * GET /api/content/sections/:sectionId
 * Get a specific tutorial section
 */
router.get('/sections/:sectionId', async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;
    const language = req.query.language as string || 'python';

    const section = await contentService.getSection(sectionId, language);

    res.json({
      success: true,
      data: section,
      timestamp: new Date()
    });
  } catch (error) {
    console.error(`Error fetching section ${req.params.sectionId}:`, error);

    if (error instanceof ContentError) {
      const statusCode = error.code === 'SECTION_NOT_FOUND' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error.message,
        code: error.code,
        timestamp: new Date()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tutorial section',
        timestamp: new Date()
      });
    }
  }
});

/**
 * GET /api/content/sections/:sectionId/snippets
 * Get code snippets for a specific section
 */
router.get('/sections/:sectionId/snippets', async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;
    const language = req.query.language as string || 'python';

    const snippets = await contentService.getCodeSnippets(sectionId, language);

    res.json({
      success: true,
      data: snippets,
      timestamp: new Date()
    });
  } catch (error) {
    console.error(`Error fetching snippets for section ${req.params.sectionId}:`, error);

    if (error instanceof ContentError) {
      const statusCode = error.code === 'SECTION_NOT_FOUND' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error.message,
        code: error.code,
        timestamp: new Date()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch code snippets',
        timestamp: new Date()
      });
    }
  }
});

/**
 * GET /api/content/metadata
 * Get content metadata
 */
router.get('/metadata', async (req: Request, res: Response) => {
  try {
    const metadata = await contentService.getContentMetadata();

    res.json({
      success: true,
      data: metadata,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching content metadata:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content metadata',
      timestamp: new Date()
    });
  }
});

/**
 * POST /api/content/refresh
 * Refresh content cache
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    await contentService.refreshContent();

    res.json({
      success: true,
      message: 'Content cache refreshed successfully',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error refreshing content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh content cache',
      timestamp: new Date()
    });
  }
});

/**
 * GET /api/content/cache/stats
 * Get cache statistics (for debugging)
 */
router.get('/cache/stats', (req: Request, res: Response) => {
  try {
    const stats = contentService.getCacheStats();

    res.json({
      success: true,
      data: stats,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching cache stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cache statistics',
      timestamp: new Date()
    });
  }
});

export default router;
