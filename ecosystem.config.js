const fs = require('fs');
const path = require('path');

function loadEnv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    env[trimmed.slice(0, eqIndex).trim()] = trimmed.slice(eqIndex + 1).trim();
  }
  return env;
}

const dotenv = loadEnv(path.resolve(__dirname, '.env.local'));

module.exports = {
  apps: [{
    name: "gotimer",
    script: "node_modules/next/dist/bin/next",
    args: "start",
    cwd: "/home/pubs/gotimer", // Path to your app on the VM
    instances: "max",          // Use all CPU cores for better performance
    exec_mode: "cluster",      // Enables zero-downtime reloads
    env: {
      NODE_ENV: "production",
      PORT: 3000,              // Change this if you use a different port
      ...dotenv,
    }
  }],

  deploy: {
    production: {
      user: "pubs",
      host: "0.0.0.0", // Replace with your actual VM IP
      ref: "origin/main",
      repo: "https://github.com/pub12/gotimer.git",
      path: "/home/pubs/gotimer",
      // This is the magic line that handles the update
      "post-deploy": "npm install && npm run build && pm2 reload ecosystem.config.js --env production",
    }
  }
};