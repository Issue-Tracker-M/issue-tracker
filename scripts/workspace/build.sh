#!/usr/bin/env bash
echo "┏━━━ 📦 Building Workspace ━━━━━━━━━━━━━━━━━━━"
yarn tsc -b packages && cd packages/webapp && yarn build