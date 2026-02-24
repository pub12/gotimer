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
      PORT: 3000               // Change this if you use a different port
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