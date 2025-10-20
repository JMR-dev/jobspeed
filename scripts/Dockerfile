# Ubuntu 24.04 LTS (Noble Numbat) - pinned version
FROM ubuntu:24.04

# Set environment variables
ENV NODE_VERSION=22
ENV PNPM_VERSION=10.18.1
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    ca-certificates \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 22
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Enable corepack and setup pnpm
RUN corepack enable \
    && corepack prepare pnpm@${PNPM_VERSION} --activate

# Install Playwright dependencies
# This installs all system dependencies needed for Chromium and Firefox
RUN npx playwright@1.56.1 install --with-deps chromium firefox

# Set working directory
WORKDIR /workspace

# Default command
CMD ["/bin/bash"]
