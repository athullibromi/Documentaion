---
title: Installation Tutorial
description: Step-by-step guide to installing our software
category: tutorials
order: 1
tags: [installation, setup, beginner]
---

# Installation Tutorial

This tutorial will guide you through the process of installing our software on your system.

## Prerequisites

Before you begin, make sure you have:

- [ ] Administrator access to your system
- [ ] Node.js 18 or higher installed
- [ ] At least 500MB of free disk space
- [ ] A stable internet connection

## Step 1: Download the Software

1. Visit our [downloads page](/)
2. Select the appropriate version for your operating system:
   - Windows: `.exe` installer
   - macOS: `.dmg` installer
   - Linux: `.deb` or `.rpm` package

![Download Page](/images/tutorials/download-page.png)

## Step 2: Run the Installer

### Windows

1. Double-click the downloaded `.exe` file
2. If prompted by User Account Control, click "Yes"
3. Follow the installation wizard instructions
4. Choose your installation directory or use the default
5. Select which components to install
6. Click "Install"

### macOS

1. Open the downloaded `.dmg` file
2. Drag the application icon to your Applications folder
3. Enter your administrator password if prompted
4. Wait for the installation to complete

### Linux

For Debian-based distributions (Ubuntu, Debian):

```bash
sudo dpkg -i package-name.deb
sudo apt-get install -f
```

For RPM-based distributions (Fedora, CentOS):

```bash
sudo rpm -i package-name.rpm
```

## Step 3: Verify Installation

1. Open a terminal or command prompt
2. Run the following command:

```bash
our-software --version
```

3. You should see the current version number displayed

## Step 4: Initial Configuration

1. Launch the application
2. You'll be prompted to create an administrator account
3. Fill in the required information:
   - Username
   - Password
   - Email address
4. Click "Create Account"
5. Follow the initial setup wizard to configure basic settings

## Step 5: Activate Your License

1. Navigate to Settings > License
2. Enter your license key
3. Click "Activate"
4. You should see a confirmation message

## Troubleshooting

### Common Installation Issues

#### Error: "Dependency not found"

This usually means a required system library is missing. Install the missing dependency:

```bash
# For Debian/Ubuntu
sudo apt-get install libssl-dev

# For Fedora/CentOS
sudo dnf install openssl-devel
```

#### Error: "Permission denied"

Make sure you have administrator privileges when installing the software.

#### Error: "Port already in use"

The default port (3000) is already being used by another application. You can change the port in the configuration file after installation.

## Next Steps

- [Configuration Guide](/tutorials/basic-setup/configuration)
- [User Management](/tutorials/basic-setup/user-management)
- [Dashboard Overview](/panel-overview/dashboard)