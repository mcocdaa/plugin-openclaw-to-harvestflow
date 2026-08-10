import { ListParams, SessionListResponse, Session, StatsResponse, ScanResponse, ImportResponse, ImportAllResponse, EvaluateResponse, EvaluateAllResponse, PendingResponse, ReviewResponse, BatchReviewResponse } from './types';
export declare class HarvestFlowClient {
    private client;
    constructor(config: {
        baseUrl: string;
        apiKey?: string;
    });
    health(): Promise<boolean>;
    getSessions(params?: ListParams): Promise<SessionListResponse>;
    getSession(sessionId: string): Promise<Session>;
    getStats(): Promise<StatsResponse>;
    scanFolder(folderPath?: string): Promise<ScanResponse>;
    importSession(filePath: string): Promise<ImportResponse>;
    importAll(folderPath?: string): Promise<ImportAllResponse>;
    evaluateSession(sessionId: string): Promise<EvaluateResponse>;
    evaluateAll(): Promise<EvaluateAllResponse>;
    getCuratorStatus(): Promise<any>;
    getPendingReviews(page?: number, pageSize?: number): Promise<PendingResponse>;
    approveSession(sessionId: string, notes?: string, score?: number): Promise<ReviewResponse>;
    rejectSession(sessionId: string, notes?: string, score?: number): Promise<ReviewResponse>;
    batchApprove(sessionIds: string[]): Promise<BatchReviewResponse>;
    batchReject(sessionIds: string[]): Promise<BatchReviewResponse>;
}
//# sourceMappingURL=client.d.ts.map