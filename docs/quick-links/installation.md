---
title: Installation
description: Detailed installation instructions for our software
category: quick-links
order: 2
tags: [installation, setup, configuration]
---

# Installation

This guide provides detailed instructions for installing our software on various platforms.

## System Requirements

Before installing, ensure your system meets the following requirements:

- **Operating System**: Windows 10+, macOS 10.15+, or Ubuntu 20.04+
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Disk Space**: At least 500MB of free disk space
- **Dependencies**: Node.js 18+ and npm 8+

## Installation Methods

### Method 1: Using npm (Recommended)

The easiest way to install our software is through npm:

```bash
npm install our-software -g
```

### Method 2: Direct Download

1. Visit our [downloads page](/)
2. Select the appropriate version for your operating system
3. Run the installer and follow the on-screen instructions

### Method 3: Using Docker

```bash
docker pull our-software/latest
docker run -p 3000:3000 our-software/latest
```

## Verifying Installation

To verify that the installation was successful, run:

```bash
our-software --version
```

You should see the current version number displayed in your terminal.

## Next Steps

- [Configuration Guide](/quick-links/common-tasks)
- [Getting Started](/quick-links/getting-started)
- [Dashboard Overview](/panel-overview/dashboard)