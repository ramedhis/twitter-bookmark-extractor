#!/usr/bin/env node

const { exec } = require('child_process');
const os = require('os');

const jsScriptName = 'extract-bookmarked-tweets.js';

// Determine the directory of this script
const scriptDir = __dirname;

// Formulate the path to the target JavaScript script
const jsScriptPath = require('path').join(scriptDir, jsScriptName);

// Check if the target JavaScript script exists
const fs = require('fs');
if (!fs.existsSync(jsScriptPath)) {
  console.error(`Error: '${jsScriptName}' not found in the same directory as this launcher.`);
  process.exit(1);
}

// Determine the platform and launch the script accordingly
const currentPlatform = os.platform();
if (currentPlatform === 'darwin') { // macOS
  exec(`open -a Terminal.app node ${jsScriptPath}`);
} else if (currentPlatform === 'linux') {
  exec(`gnome-terminal -- bash -c "node ${jsScriptPath}; read -p 'Press Enter to exit...'"`);
} else if (currentPlatform === 'win32') {
  exec(`start cmd /K "node ${jsScriptPath}"`);
} else {
  console.error('Error: Unsupported platform.');
  process.exit(1);
}
