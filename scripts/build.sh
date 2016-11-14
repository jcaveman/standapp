#!/bin/bash
rm -rf build
node ./scripts/precompile-hbs.js
broccoli build build
rm tmp/*
