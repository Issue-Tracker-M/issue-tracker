#!/usr/bin/env bash
echo "┏━━━ 🕵️‍♀️ LINT: eslint \"**/*.ts\" --quiet --fix && tsc --noEmit ━━━━━━━"
# yarn eslint src --ext ts,js,tsx,jsx
yarn eslint src --ext ts,js,tsx,jsx --quiet --fix && tsc --noEmit