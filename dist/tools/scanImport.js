"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.harvestflowScanImport = harvestflowScanImport;
async function harvestflowScanImport(client, args) {
    try {
        const action = args.action;
        if (!action) {
            return { success: false, error: 'Missing required parameter: action' };
        }
        if (action === 'scan') {
            const result = await client.scanFolder(args.folder_path);
            return { success: true, data: result };
        }
        if (action === 'import') {
            if (!args.file_path) {
                return { success: false, error: 'Missing required parameter: file_path' };
            }
            const result = await client.importSession(args.file_path);
            return { success: true, data: result };
        }
        if (action === 'import_all') {
            const result = await client.importAll(args.folder_path);
            return { success: true, data: result };
        }
        return { success: false, error: `Invalid action: ${action}` };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
//# sourceMappingURL=scanImport.js.map