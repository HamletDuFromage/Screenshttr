#!/bin/bash
rm -r dist/
zip -r source.zip src/ README.md LICENSE package.json package-lock.json webpack.config.js
npm run build
pushd dist
rm screenshttr-unpacked.zip
zip -r screenshttr-unpacked.zip ./*
popd
