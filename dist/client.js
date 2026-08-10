"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestFlowClient = void 0;
const axios_1 = __importDefault(require("axios"));
class HarvestFlowClient {
    client;
    constructor(config) {
        this.client = axios_1.default.create({
            baseURL: config.baseUrl,
            headers: {
                'Content-Type': 'application/json',
                ...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {})
            }
        });
        // Error handling middleware
        this.client.interceptors.response.use((response) => response, (error) => {
            let message = 'HarvestFlow API Error';
            if (error.response) {
                message = `API Error [${error.response.status}]: ${JSON.stringify(error.response.data)}`;
            }
            else if (error.request) {
                message = 'Connection Error: Cannot reach HarvestFlow backend';
            }
            else {
                message = `Error: ${error.message}`;
            }
            return Promise.reject(new Error(message));
        });
    }
    async health() {
        try {
            const response = await this.client.get('/health');
            return response.status === 200;
        }
        catch {
            return false;
        }
    }
    // Session Methods
    async getSessions(params) {
        const response = await this.client.get('/api/v1/sessions', { params });
        return response.data;
    }
    async getSession(sessionId) {
        const response = await this.client.get(`/api/v1/sessions/${sessionId}`);
        return response.data;
    }
    async getStats() {
        const response = await this.client.get('/api/v1/stats');
        return response.data;
    }
    // Collector Methods
    async scanFolder(folderPath) {
        const params = folderPath ? { folder_path: folderPath } : {};
        const response = await this.client.get('/api/v1/collector/scan', { params });
        return response.data;
    }
    async importSession(filePath) {
        const response = await this.client.post('/api/v1/collector/import', null, {
            params: { file_path: filePath }
        });
        return response.data;
    }
    async importAll(folderPath) {
        const params = folderPath ? { folder_path: folderPath } : {};
        const response = await this.client.post('/api/v1/collector/import-all', null, { params });
        return response.data;
    }
    // Curator Methods
    async evaluateSession(sessionId) {
        const response = await this.client.post(`/api/v1/curator/evaluate/${sessionId}`);
        return response.data;
    }
    async evaluateAll() {
        const response = await this.client.post('/api/v1/curator/evaluate-all');
        return response.data;
    }
    async getCuratorStatus() {
        const response = await this.client.get('/api/v1/curator/status');
        return response.data;
    }
    // Reviewer Methods
    async getPendingReviews(page = 1, pageSize = 20) {
        const response = await this.client.get('/api/v1/reviewer/pending', {
            params: { page, page_size: pageSize }
        });
        return response.data;
    }
    async approveSession(sessionId, notes, score) {
        const response = await this.client.post(`/api/v1/reviewer/approve/${sessionId}`, null, {
            params: { notes, score }
        });
        return response.data;
    }
    async rejectSession(sessionId, notes, score) {
        const response = await this.client.post(`/api/v1/reviewer/reject/${sessionId}`, null, {
            params: { notes, score }
        });
        return response.data;
    }
    async batchApprove(sessionIds) {
        const response = await this.client.post('/api/v1/reviewer/batch-approve', null, {
            params: { session_ids: sessionIds.join(',') }
        });
        return response.data;
    }
    async batchReject(sessionIds) {
        const response = await this.client.post('/api/v1/reviewer/batch-reject', null, {
            params: { session_ids: sessionIds.join(',') }
        });
        return response.data;
    }
}
exports.HarvestFlowClient = HarvestFlowClient;
//# sourceMappingURL=client.js.map