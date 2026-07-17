# n8n-nodes-droidrun

This is an n8n community node that lets you use MobileRun in your n8n workflows to automate tasks on Android devices via the MobileRun Cloud API.

[n8n](https://n8n.io/) is a fair code licensed workflow automation platform.

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

### App Store
- **List Apps**: Retrieves a list of apps with filtering and search capabilities.

### Device
- **Connect Proxy**: Connect a proxy to the device.
- **Delete Device**: Delete a specific device.
- **Disconnect Proxy**: Disconnect the proxy from the device.
- **Get Device**: Get details of a specific device.
- **Get Device Tasks**: Get tasks for a specific device.
- **List Devices**: Retrieves a list of devices with filtering and search.
- **Wait for Device**: Wait for a device to be ready.

### Device Credential
- **Add New Field**: Add a new field to an existing credential.
- **Create Credential Field**: Create a credential with fields for a package.
- **Delete Specific Credential**: Delete a credential and all its fields.
- **Delete Specific Credential Field**: Delete a field from a credential.
- **Get Specific Credential**: Get a specific credential with its fields.
- **Initialize Package**: Initialize a new package or app.
- **List Credentials**: List all credentials.
- **List Package Credentials**: List credentials for a specific package.

### Inspect Task
- **Get Task**: Get details of a task.
- **Get Task Screenshot**: Get a screenshot of a task.
- **Get Task Screenshots**: Get a list of screenshots of a task.
- **Get Task Status**: Get the status of a task.
- **Get Task Trajectory**: Get the trajectory of a task.
- **Get Task UI State**: Get a specific UI state of a task.
- **Get Task UI States**: Get UI states of a task.
- **List Tasks**: List all tasks you have created so far.

### Manage Task
- **Run Task**: Run a task on a device.
  - Supports LLM model selection (fetched from LiteLLM endpoint).
  - Optional device selection (fetched from API or manual entry).
  - Apps selection (fetched from API for dropdown).
  - Structured output support via JSON schema.
  - Optional file attachments.
- **Run Task and Wait**: Run a task and wait until it is completed, failed, or cancelled.
- **Stop Task**: Stops a running task.

## Credentials

This node requires a MobileRun API Token.

- Create a MobileRun account and obtain an API key from your dashboard.
- In n8n, create new credentials of type `MobileRun API` and paste your token.
- The token will be sent as `Authorization: Bearer <token>` to the MobileRun API.

Reference: `https://docs.mobilerun.ai/api-reference/`

## Compatibility

- Built for the n8n Nodes API v1.
- Developed with Node.js >= 20.15.

## Usage

1. Add the `MobileRun` node to your workflow.
2. Select the `Resource` (App Store, Device, Device Credential, Inspect Task, or Manage Task) and choose an `Operation`.
3. Provide required parameters (for example, `Task ID` for inspect operations or `Task` and model settings for `Run Task`).
4. Execute the workflow.

## Resources

- n8n community nodes docs: `https://docs.n8n.io/integrations/#community-nodes`
- MobileRun API reference: `https://docs.mobilerun.ai/api-reference/`
- MobileRun website: `https://droidrun.ai/`

## Version history

- 1.0.3: Initial public release of the Tasks node
