#!/usr/bin/env bash
echo "┏━━━ 🕵️‍♀️ LINT: eslint \"**/*.ts,js,tsx,jsx\" --fix && tsc --noEmit ━━━━━━━"
# yarn eslint src --ext ts,js,tsx,jsx
yarn eslint src --ext ts,js,tsx,jsx --quiet --fix && tsc --noEmit