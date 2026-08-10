"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.harvestflowList = harvestflowList;
async function harvestflowList(client, args) {
    try {
        if (args.stats === true || args.stats === 'true') {
            const stats = await client.getStats();
            return { success: true, data: stats };
        }
        if (args.session_id) {
            const session = await client.getSession(args.session_id);
            return { success: true, data: session };
        }
        const params = {
            status: args.status,
            page: args.page ? parseInt(args.page, 10) : 1,
            page_size: args.page_size ? parseInt(args.page_size, 10) : 20,
        };
        const list = await client.getSessions(params);
        return { success: true, data: list };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
//# sourceMappingURL=list.js.map