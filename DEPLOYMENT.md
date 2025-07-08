# Firebase Deployment Guide

This guide will help you deploy the UniOvi Monitor to Firebase Hosting.

## Prerequisites

1. **Node.js** (version 14 or higher)
2. **Firebase CLI** (will be installed via npm)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Login to Firebase

```bash
npx firebase login
```

### 3. Initialize Firebase Project (if not already done)

```bash
npx firebase init hosting
```

When prompted:
- Choose "Use an existing project" or create a new one
- Set public directory to: `uniovi-monitor`
- Configure as single-page app: `No`
- Set up automatic builds: `No`

### 4. Deploy to Firebase

```bash
npm run deploy
```

Or deploy only hosting:

```bash
npm run deploy:hosting
```

## Project Structure

```
uniovi-monitor/
├── index.html          # Main application page
├── monitor.js          # Monitor logic
├── styles.css          # Application styles
├── test-connection.html # Test page
└── README.md           # Project documentation

firebase.json           # Firebase configuration
.firebaserc            # Firebase project settings
package.json            # Node.js dependencies
.gitignore             # Git ignore rules
```

## Firebase Configuration

The `firebase.json` file is configured to:
- Serve files from the `uniovi-monitor` directory
- Ignore unnecessary files (node_modules, .git, etc.)
- Redirect all routes to index.html for SPA behavior

## Troubleshooting

### "Not in a Firebase app directory" Error

This error occurs when Firebase can't find the configuration files. Make sure:
1. You're in the project root directory
2. `firebase.json` exists in the root
3. `.firebaserc` exists in the root

### Deployment Issues

If deployment fails:
1. Check that you're logged in: `npx firebase login`
2. Verify project selection: `npx firebase use --add`
3. Check Firebase console for any project-specific issues

## Local Development

To test locally before deploying:

```bash
npm start
```

This will start a local server at `http://localhost:5000`

## Environment Variables

No environment variables are required for this static application.

## Security Rules

Firebase Hosting serves static files, so no security rules are needed for this application. 