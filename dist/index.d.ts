declare const _default: Omit<{
    id: string;
    name: string;
    description: string;
    kind?: import("openclaw/plugin-sdk/plugin-entry", { with: { "resolution-mode": "import" } }).OpenClawPluginDefinition["kind"];
    configSchema?: import("openclaw/plugin-sdk/plugin-entry", { with: { "resolution-mode": "import" } }).OpenClawPluginConfigSchema | (() => import("openclaw/plugin-sdk/plugin-entry", { with: { "resolution-mode": "import" } }).OpenClawPluginConfigSchema);
    reload?: import("openclaw/plugin-sdk/plugin-entry", { with: { "resolution-mode": "import" } }).OpenClawPluginDefinition["reload"];
    nodeHostCommands?: import("openclaw/plugin-sdk/plugin-entry", { with: { "resolution-mode": "import" } }).OpenClawPluginDefinition["nodeHostCommands"];
    securityAuditCollectors?: import("openclaw/plugin-sdk/plugin-entry", { with: { "resolution-mode": "import" } }).OpenClawPluginDefinition["securityAuditCollectors"];
    register: NonNullable<import("openclaw/plugin-sdk/plugin-entry", { with: { "resolution-mode": "import" } }).OpenClawPluginDefinition["register"]>;
}, "configSchema"> & {
    configSchema: import("openclaw/plugin-sdk/plugin-entry", { with: { "resolution-mode": "import" } }).OpenClawPluginConfigSchema;
};
export default _default;
//# sourceMappingURL=index.d.ts.map