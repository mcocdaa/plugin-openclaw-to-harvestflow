"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.harvestflowEvaluate = harvestflowEvaluate;
async function harvestflowEvaluate(client, args) {
    try {
        const scope = args.scope || 'single';
        const action = args.action || 'evaluate';
        if (action === 'status') {
            const status = await client.getCuratorStatus();
            return { success: true, data: status };
        }
        if (scope === 'all') {
            const result = await client.evaluateAll();
            return { success: true, data: result };
        }
        if (!args.session_id) {
            return { success: false, error: 'Missing required parameter: session_id' };
        }
        const result = await client.evaluateSession(args.session_id);
        return { success: true, data: result };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
//# sourceMappingURL=evaluate.js.map