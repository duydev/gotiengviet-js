# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-09-13

### Added
- Initial stable release of gotiengviet-js.
- Vietnamese input support for Telex, VNI, and VIQR.
- Smart detection to avoid modifying emails, URLs, and code-like tokens.
- `VietnameseInput` public API: `getInstance`, `destroyInstance`, `enable`, `disable`, `toggle`, `setInputMethod`, `getInputMethod`.
- TypeScript type definitions and Rollup build artifacts.
- Unit tests (Jest) and CI workflow.