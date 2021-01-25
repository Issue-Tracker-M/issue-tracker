#!/usr/bin/env bash
echo "┏━━━ 🎯 Starting dev server: $(pwd) ━━━━━━━━━━━━━━━━━━━"
lerna run dev --stream -- "$@"