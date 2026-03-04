module.exports = {
  apps: [{
    name: "workflow-breaker",
    script: "node_modules/next/dist/bin/next",
    args: "start -p 3003",
    cwd: "/opt/workflow-breaker",
    env: {
      NODE_ENV: "production",
      PORT: 3003,
    },
  }],
};
