import { Router, Request, Response } from 'express';
import { deviceStore } from '../mastra/stores/device.store';
import { telemetryStore } from '../mastra/tools/telemetry.tool';
import { mastra } from '../mastra';
import { ApiResponse } from '../shared';

export const router = Router();

/**
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Get all devices
 */
router.get('/devices', async (req: Request, res: Response) => {
  try {
    const devices = await deviceStore.getAllDevices();
    const response: ApiResponse = {
      success: true,
      data: devices,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch devices',
    };
    res.status(500).json(response);
  }
});

/**
 * Get device by ID
 */
router.get('/devices/:id', async (req: Request, res: Response) => {
  try {
    const device = await deviceStore.getDevice(req.params.id);
    if (!device) {
      const response: ApiResponse = {
        success: false,
        error: 'Device not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: device,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch device',
    };
    res.status(500).json(response);
  }
});

/**
 * Get device telemetry
 */
router.get('/devices/:id/telemetry', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const telemetry = telemetryStore.getTelemetry(req.params.id, limit);

    const response: ApiResponse = {
      success: true,
      data: telemetry,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch telemetry',
    };
    res.status(500).json(response);
  }
});

/**
 * Chat with NEXUS agent
 */
router.post('/agent/chat', async (req: Request, res: Response) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      const response: ApiResponse = {
        success: false,
        error: 'Message is required',
      };
      return res.status(400).json(response);
    }

    // Get the NEXUS agent
    const agent = mastra.getAgent('nexusAgent');

    if (!agent) {
      const response: ApiResponse = {
        success: false,
        error: 'Agent not found',
      };
      return res.status(500).json(response);
    }

    // Generate response from agent
    const result = await agent.generate(message, {
      conversationId: conversationId || `conv_${Date.now()}`,
    });

    const response: ApiResponse = {
      success: true,
      data: {
        text: result.text,
        conversationId: conversationId || `conv_${Date.now()}`,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Agent error:', error);
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate response',
    };
    res.status(500).json(response);
  }
});

/**
 * Stream agent response (for real-time chat)
 */
router.post('/agent/stream', async (req: Request, res: Response) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get the NEXUS agent
    const agent = mastra.getAgent('nexusAgent');

    if (!agent) {
      return res.status(500).json({ error: 'Agent not found' });
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream response (AI SDK v5)
    const stream = await agent.stream([
      {
        role: 'user',
        content: message,
      },
    ]);

    for await (const chunk of stream.textStream) {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to stream response',
    });
  }
});
