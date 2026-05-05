/**
 * HarvestFlow OpenClaw Plugin
 * Registers 4 agent tools for HarvestFlow session management
 */

const DEFAULT_BASE_URL = "http://localhost:3000";
const API_PREFIX = "/api/v1";

/**
 * HTTP request helper for HarvestFlow API
 */
async function apiRequest(
  baseUrl: string,
  method: string,
  path: string,
  body?: object,
  apiKey?: string
): Promise<unknown> {
  const url = `${baseUrl}${API_PREFIX}${path}`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }
  const options: RequestInit = {
    method,
    headers,
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HarvestFlow API error ${response.status}: ${errorText}`);
  }
  return response.json();
}

/**
 * Resolve config from plugin config
 */
function getConfig(api: any): { baseUrl: string; apiKey: string } {
  try {
    const cfg = api.getConfig?.() || {};
    return {
      baseUrl: cfg.HARVESTFLOW_API_URL || process.env.HARVESTFLOW_API_URL || DEFAULT_BASE_URL,
      apiKey: cfg.HARVESTFLOW_API_KEY || process.env.HARVESTFLOW_API_KEY || "",
    };
  } catch {
    return {
      baseUrl: process.env.HARVESTFLOW_API_URL || DEFAULT_BASE_URL,
      apiKey: process.env.HARVESTFLOW_API_KEY || "",
    };
  }
}

/**
 * Plugin entry point - standard OpenClaw format
 */
export default function (api: any) {
  api.logger?.info?.("[harvestflow] HarvestFlow plugin loading...");

  const { baseUrl, apiKey } = getConfig(api);

  // Tool 1: harvestflow_list - List sessions and stats
  api.registerTool({
    name: "harvestflow_list",
    description:
      "List or get HarvestFlow sessions and stats.",
    parameters: {
      type: "object",
      properties: {
        stats: {
          type: ["boolean", "string"],
          description: "Set to true to get statistics instead of session list",
        },
        session_id: {
          type: "string",
          description: "Get a specific session by ID",
        },
        status: {
          type: "string",
          description: "Filter by status (e.g., raw, approved, rejected)",
        },
        page: {
          type: ["number", "string"],
          description: "Page number",
          default: 1,
        },
        page_size: {
          type: ["number", "string"],
          description: "Items per page",
          default: 20,
        },
      },
    },
    async execute(_id: string, params: any) {
      if (params.stats === true || params.stats === "true") {
        const result = await apiRequest(baseUrl, "GET", "/sessions/stats", undefined, apiKey);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      }

      if (params.session_id) {
        const result = await apiRequest(baseUrl, "GET", `/sessions/${params.session_id}`, undefined, apiKey);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      }

      const qs = new URLSearchParams();
      if (params.status) qs.set("status", params.status);
      qs.set("page", String(params.page || 1));
      qs.set("page_size", String(params.page_size || 20));

      const result = await apiRequest(baseUrl, "GET", `/sessions?${qs.toString()}`, undefined, apiKey);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    },
  });

  // Tool 2: harvestflow_scan_import - Scan or import sessions
  api.registerTool({
    name: "harvestflow_scan_import",
    description:
      "Scan or import HarvestFlow sessions.",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          description: "Action to perform: scan, import, or import_all",
        },
        folder_path: {
          type: "string",
          description: "Folder path for scan or import_all",
        },
        file_path: {
          type: "string",
          description: "File path for import",
        },
      },
      required: ["action"],
    },
    async execute(_id: string, params: any) {
      const action = params.action;

      if (action === "scan") {
        const qs = new URLSearchParams();
        if (params.folder_path) qs.set("folder_path", params.folder_path);
        const result = await apiRequest(baseUrl, "GET", `/collector/scan?${qs.toString()}`, undefined, apiKey);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      }

      if (action === "import") {
        if (!params.file_path) {
          throw new Error("Missing required parameter: file_path");
        }
        const result = await apiRequest(baseUrl, "POST", "/collector/import", { file_path: params.file_path }, apiKey);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      }

      if (action === "import_all") {
        const body = params.folder_path ? { folder_path: params.folder_path } : {};
        const result = await apiRequest(baseUrl, "POST", "/collector/import-all", body, apiKey);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      }

      throw new Error(`Invalid action: ${action}. Must be scan, import, or import_all`);
    },
  });

  // Tool 3: harvestflow_evaluate - Evaluate sessions
  api.registerTool({
    name: "harvestflow_evaluate",
    description:
      "Evaluate HarvestFlow sessions.",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          description: "evaluate or status",
          default: "evaluate",
        },
        scope: {
          type: "string",
          description: "single or all",
          default: "single",
        },
        session_id: {
          type: "string",
          description: "Session ID for single evaluation",
        },
      },
    },
    async execute(_id: string, params: any) {
      const action = params.action || "evaluate";

      if (action === "status") {
        const result = await apiRequest(baseUrl, "GET", "/curator/status", undefined, apiKey);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      }

      const scope = params.scope || "single";

      if (scope === "all") {
        const result = await apiRequest(baseUrl, "POST", "/curator/evaluate-all", {}, apiKey);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      }

      if (!params.session_id) {
        throw new Error("Missing required parameter: session_id");
      }

      const result = await apiRequest(baseUrl, "POST", `/curator/evaluate/${params.session_id}`, {}, apiKey);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    },
  });

  // Tool 4: harvestflow_review - Review sessions (approve/reject)
  api.registerTool({
    name: "harvestflow_review",
    description:
      "Review HarvestFlow sessions (approve/reject).",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          description: "Action: pending, approve, reject, batch_approve, batch_reject",
        },
        page: {
          type: ["number", "string"],
          description: "Page number for pending",
          default: 1,
        },
        page_size: {
          type: ["number", "string"],
          description: "Items per page for pending",
          default: 20,
        },
        session_id: {
          type: "string",
          description: "Session ID for approve/reject",
        },
        session_ids: {
          type: "array",
          items: { type: "string" },
          description: "Array of session IDs for batch operations",
        },
        notes: {
          type: "string",
          description: "Review notes",
        },
        score: {
          type: ["number", "string"],
          description: "Quality score",
        },
      },
      required: ["action"],
    },
    async execute(_id: string, params: any) {
      const action = params.action;

      if (action === "pending") {
        const page = params.page || 1;
        const pageSize = params.page_size || 20;
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        qs.set("page_size", String(pageSize));
        const result = await apiRequest(baseUrl, "GET", `/reviewer/pending?${qs.toString()}`, undefined, apiKey);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      }

      if (action === "approve") {
        if (!params.session_id) {
          throw new Error("Missing required parameter: session_id");
        }
        const body: any = {};
        if (params.notes) body.notes = params.notes;
        if (params.score !== undefined) body.score = Number(params.score);
        const result = await apiRequest(baseUrl, "POST", `/reviewer/approve/${params.session_id}`, body, apiKey);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      }

      if (action === "reject") {
        if (!params.session_id) {
          throw new Error("Missing required parameter: session_id");
        }
        const body: any = {};
        if (params.notes) body.notes = params.notes;
        if (params.score !== undefined) body.score = Number(params.score);
        const result = await apiRequest(baseUrl, "POST", `/reviewer/reject/${params.session_id}`, body, apiKey);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      }

      if (action === "batch_approve") {
        if (!params.session_ids || !Array.isArray(params.session_ids)) {
          throw new Error("Missing or invalid parameter: session_ids (must be array)");
        }
        const result = await apiRequest(baseUrl, "POST", "/reviewer/batch/approve", { session_ids: params.session_ids }, apiKey);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      }

      if (action === "batch_reject") {
        if (!params.session_ids || !Array.isArray(params.session_ids)) {
          throw new Error("Missing or invalid parameter: session_ids (must be array)");
        }
        const result = await apiRequest(baseUrl, "POST", "/reviewer/batch/reject", { session_ids: params.session_ids }, apiKey);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      }

      throw new Error(`Invalid action: ${action}. Must be pending, approve, reject, batch_approve, or batch_reject`);
    },
  });

  api.logger?.info?.("[harvestflow] HarvestFlow plugin loaded: 4 tools registered");
}
