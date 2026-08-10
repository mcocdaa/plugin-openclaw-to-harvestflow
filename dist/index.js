"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_entry_1 = require("openclaw/plugin-sdk/plugin-entry");
const typebox_1 = require("@sinclair/typebox");
const client_1 = require("./client");
const list_1 = require("./tools/list");
const scanImport_1 = require("./tools/scanImport");
const evaluate_1 = require("./tools/evaluate");
const review_1 = require("./tools/review");
exports.default = (0, plugin_entry_1.definePluginEntry)({
    id: "harvestflow",
    name: "HarvestFlow",
    description: "HarvestFlow integration for OpenClaw Agents",
    register(api) {
        const config = api.config || {};
        const baseUrl = process.env.HARVESTFLOW_API_URL || config.HARVESTFLOW_API_URL || 'http://localhost:3001';
        const apiKey = process.env.HARVESTFLOW_API_KEY || config.HARVESTFLOW_API_KEY || '';
        const client = new client_1.HarvestFlowClient({ baseUrl, apiKey });
        api.registerTool({
            name: 'harvestflow_list',
            description: 'List or get HarvestFlow sessions and stats.',
            parameters: typebox_1.Type.Object({
                stats: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Boolean(), typebox_1.Type.String()])),
                session_id: typebox_1.Type.Optional(typebox_1.Type.String()),
                status: typebox_1.Type.Optional(typebox_1.Type.String()),
                page: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Number(), typebox_1.Type.String()])),
                page_size: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Number(), typebox_1.Type.String()]))
            }),
            async execute(_id, args) {
                const result = await (0, list_1.harvestflowList)(client, args);
                return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
            }
        });
        api.registerTool({
            name: 'harvestflow_scan_import',
            description: 'Scan or import HarvestFlow sessions.',
            parameters: typebox_1.Type.Object({
                action: typebox_1.Type.String({ description: 'scan, import, or import_all' }),
                folder_path: typebox_1.Type.Optional(typebox_1.Type.String()),
                file_path: typebox_1.Type.Optional(typebox_1.Type.String())
            }),
            async execute(_id, args) {
                const result = await (0, scanImport_1.harvestflowScanImport)(client, args);
                return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
            }
        });
        api.registerTool({
            name: 'harvestflow_evaluate',
            description: 'Evaluate HarvestFlow sessions.',
            parameters: typebox_1.Type.Object({
                action: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'evaluate or status' })),
                scope: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'single or all' })),
                session_id: typebox_1.Type.Optional(typebox_1.Type.String())
            }),
            async execute(_id, args) {
                const result = await (0, evaluate_1.harvestflowEvaluate)(client, args);
                return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
            }
        });
        api.registerTool({
            name: 'harvestflow_review',
            description: 'Review HarvestFlow sessions (approve/reject).',
            parameters: typebox_1.Type.Object({
                action: typebox_1.Type.String({ description: 'pending, approve, reject, batch_approve, batch_reject' }),
                page: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Number(), typebox_1.Type.String()])),
                page_size: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Number(), typebox_1.Type.String()])),
                session_id: typebox_1.Type.Optional(typebox_1.Type.String()),
                session_ids: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
                notes: typebox_1.Type.Optional(typebox_1.Type.String()),
                score: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Number(), typebox_1.Type.String()]))
            }),
            async execute(_id, args) {
                const result = await (0, review_1.harvestflowReview)(client, args);
                return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
            }
        });
        console.log(`[HarvestFlow] Plugin activated. Target API: ${baseUrl}`);
    }
});
//# sourceMappingURL=index.js.map