module.exports = {
  apps: [
    {
      name: 'costify',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
      env_production: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
    },
  ],
}; 