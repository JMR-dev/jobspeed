# Playwright Runner Docker Image

This directory contains a Dockerfile for running Playwright e2e tests in CI/CD.

## Overview

The Docker image is based on **Ubuntu 24.04 LTS (Noble Numbat)** and includes:
- Node.js 22
- pnpm 10.18.1 (via corepack)
- Playwright 1.56.1 with Chromium and Firefox browsers and all system dependencies

## Local Testing

Build the image locally:

```bash
docker build -t jobspeed-playwright-runner:latest -f scripts/Dockerfile .
```

Run e2e tests in the container:

```bash
docker run --rm -e CI=true \
  -v $(pwd):/workspace \
  -w /workspace/job-application-demo \
  jobspeed-playwright-runner:latest \
  bash -c "pnpm install --frozen-lockfile && pnpm test:e2e"
```

## CI/CD Usage

The image is automatically built and pushed to GitHub Container Registry (ghcr.io) when:
- Changes are pushed to the `main` branch that affect `scripts/Dockerfile`
- The workflow is manually triggered

The `status-checks.yml` workflow uses this image for running e2e tests, eliminating the need for:
- Manual pnpm setup
- Node.js setup
- Playwright browser installation

## Image Location

The image is published to: `ghcr.io/<repository-owner>/jobspeed-playwright-runner:latest`
