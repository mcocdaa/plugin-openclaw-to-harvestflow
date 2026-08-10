export interface ToolResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}
export interface ListParams {
    status?: 'raw' | 'approved' | 'rejected';
    page?: number;
    page_size?: number;
}
export interface Session {
    session_id: string;
    file_path: string;
    status: string;
    quality_auto_score?: number;
    quality_manual_score?: number;
    agent_role?: string;
    task_type?: string;
    tools_used?: string[];
    tags?: string[];
    created_at?: string;
    updated_at?: string;
    content?: any;
    [key: string]: any;
}
export interface SessionListResponse {
    sessions: Session[];
    total: number;
    page: number;
    page_size: number;
}
export interface StatsResponse {
    total_sessions: number;
    raw_sessions: number;
    approved_sessions: number;
    rejected_sessions: number;
    curated_sessions: number;
    reviewed_sessions: number;
    avg_auto_score: number;
}
export interface ScanResponse {
    folder_path?: string;
    files_found: number;
    files: string[];
}
export interface ImportResponse {
    success: boolean;
    session_id: string;
}
export interface ImportAllResponse {
    total: number;
    imported: number;
    skipped: number;
    failed: number;
    failed_files: string[];
    session_ids?: string[];
    skipped_ids?: string[];
}
export interface EvaluateResponse {
    session_id: string;
    score: number;
    is_high_value: boolean;
    tags: string[];
    tools_used: string[];
    evaluation_details?: any;
}
export interface EvaluateAllResponse {
    total: number;
    high_value: number;
    low_value: number;
    results: EvaluateResponse[];
}
export interface PendingResponse {
    sessions: Session[];
    total: number;
    page: number;
    page_size: number;
}
export interface ReviewResponse {
    success: boolean;
    session: any;
}
export interface BatchReviewResponse {
    total: number;
    success: number;
    failed: number;
    results: Array<{
        session_id: string;
        success: boolean;
    }>;
}
//# sourceMappingURL=index.d.ts.map