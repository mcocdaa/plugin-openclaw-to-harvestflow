# HarvestFlow Skill

HarvestFlow session data collection and curation integration for OpenClaw.

## Tools

- **harvestflow_list** - List or get HarvestFlow sessions and stats
- **harvestflow_scan_import** - Scan or import HarvestFlow sessions
- **harvestflow_evaluate** - Evaluate HarvestFlow sessions
- **harvestflow_review** - Review HarvestFlow sessions (approve/reject)

## Configuration

Set in your OpenClaw config:

```json
{
  "harvestflow": {
    "HARVESTFLOW_API_URL": "http://localhost:3001",
    "HARVESTFLOW_API_KEY": ""
  }
}
```

Or use environment variables:
- `HARVESTFLOW_API_URL`
- `HARVESTFLOW_API_KEY`
