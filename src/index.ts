import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { Type } from "@sinclair/typebox";
import { HarvestFlowClient } from './client';
import { harvestflowList } from './tools/list';
import { harvestflowScanImport } from './tools/scanImport';
import { harvestflowEvaluate } from './tools/evaluate';
import { harvestflowReview } from './tools/review';

export default definePluginEntry({
  id: "harvestflow",
  name: "HarvestFlow",
  description: "HarvestFlow integration for OpenClaw Agents",
  register(api: any) {
    const config = api.config || {};
    const baseUrl = process.env.HARVESTFLOW_API_URL || config.HARVESTFLOW_API_URL || 'http://localhost:3001';
    const apiKey = process.env.HARVESTFLOW_API_KEY || config.HARVESTFLOW_API_KEY || '';

    const client = new HarvestFlowClient({ baseUrl, apiKey });

    api.registerTool({
      name: 'harvestflow_list',
      description: 'List or get HarvestFlow sessions and stats.',
      parameters: Type.Object({
        stats: Type.Optional(Type.Union([Type.Boolean(), Type.String()])),
        session_id: Type.Optional(Type.String()),
        status: Type.Optional(Type.String()),
        page: Type.Optional(Type.Union([Type.Number(), Type.String()])),
        page_size: Type.Optional(Type.Union([Type.Number(), Type.String()]))
      }),
      async execute(_id: string, args: any) {
        const result = await harvestflowList(client, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    });

    api.registerTool({
      name: 'harvestflow_scan_import',
      description: 'Scan or import HarvestFlow sessions.',
      parameters: Type.Object({
        action: Type.String({ description: 'scan, import, or import_all' }),
        folder_path: Type.Optional(Type.String()),
        file_path: Type.Optional(Type.String())
      }),
      async execute(_id: string, args: any) {
        const result = await harvestflowScanImport(client, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    });

    api.registerTool({
      name: 'harvestflow_evaluate',
      description: 'Evaluate HarvestFlow sessions.',
      parameters: Type.Object({
        action: Type.Optional(Type.String({ description: 'evaluate or status' })),
        scope: Type.Optional(Type.String({ description: 'single or all' })),
        session_id: Type.Optional(Type.String())
      }),
      async execute(_id: string, args: any) {
        const result = await harvestflowEvaluate(client, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    });

    api.registerTool({
      name: 'harvestflow_review',
      description: 'Review HarvestFlow sessions (approve/reject).',
      parameters: Type.Object({
        action: Type.String({ description: 'pending, approve, reject, batch_approve, batch_reject' }),
        page: Type.Optional(Type.Union([Type.Number(), Type.String()])),
        page_size: Type.Optional(Type.Union([Type.Number(), Type.String()])),
        session_id: Type.Optional(Type.String()),
        session_ids: Type.Optional(Type.Array(Type.String())),
        notes: Type.Optional(Type.String()),
        score: Type.Optional(Type.Union([Type.Number(), Type.String()]))
      }),
      async execute(_id: string, args: any) {
        const result = await harvestflowReview(client, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    });

    console.log(`[HarvestFlow] Plugin activated. Target API: ${baseUrl}`);
  }
});