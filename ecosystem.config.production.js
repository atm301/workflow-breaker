module.exports = {
  apps: [{
    name: "workflow-breaker",
    script: ".next/standalone/server.js",
    cwd: "/opt/workflow-breaker",
    exec_mode: "fork",
    env: {
      NODE_ENV: "production",
      PORT: 3003,
      HOSTNAME: "0.0.0.0",
    },
  }],
};
