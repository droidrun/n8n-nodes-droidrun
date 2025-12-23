#!/usr/bin/env bash

export WEBHOOK_URL="https://4768e91ffc2c.ngrok-free.app/"
export CODE_ENABLE_STDOUT=true
export N8N_LOG_OUTPUT="console,file"
export N8N_LOG_FILE_LOCATION="./n8n.log"
export N8N_LOG_LEVEL=debug

pnpm dev
