#!/usr/bin/env bash
echo "┏━━━ 🎯 Running tsc in build mode: $(pwd) ━━━━━━━━━━━━━━━━━━━"
cd packages && tsc -b --watch