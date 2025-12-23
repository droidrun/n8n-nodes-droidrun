# n8n-nodes-droidrun

This is an n8n community node that lets you use Droidrun AI in your n8n workflows to automate tasks on Android devices via the Droidrun Cloud API.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Usage](#usage)
- [Resources](#resources)
- [Version history](#version-history)

## Installation

Follow the n8n community nodes [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

## Operations

This node exposes the following resources and operations:

- Inspect Task
  - Get Task
  - Get Task Gif
  - Get Task Screenshot
  - Get Task Screenshots
  - Get Task Status
  - List Tasks

- Manage Task
  - Run Task
    - Supports LLM model selection (fetched from LiteLLM endpoint)
    - Optional device selection (fetched from API or manual entry)
    - Apps selection (fetched from API for dropdown)
    - Structured output support via JSON schema
    - Optional file attachments
  - Stop Task

## Credentials

This node requires a Droidrun API Token.

- Create a Droidrun account and obtain an API key from your dashboard.
- In n8n, create new credentials of type `Droidrun API` and paste your token.
- The token will be sent as `Authorization: Bearer <token>` to the Droidrun API.

Reference: `https://docs.droidrun.ai/api-reference/`

## Compatibility

- Built for the n8n Nodes API v1.
- Developed with Node.js >= 20.15.

## Usage

1. Add the `Droidrun` node to your workflow.
2. Select the `Resource` (Inspect Task or Manage Task) and choose an `Operation`.
3. Provide required parameters (for example, `Task ID` for inspect operations or `Task` and model settings for `Run Task`).
4. Execute the workflow.

## Resources

- n8n community nodes docs: `https://docs.n8n.io/integrations/#community-nodes`
- Droidrun API reference: `https://docs.droidrun.ai/api-reference/`
- Droidrun website: `https://droidrun.ai/`

## Version history

- 1.0.3: Initial public release of the Droidrun Tasks node
