module.exports = {
  apps: [{
    name: 'nibog',
    script: 'npm',
    args: 'run dev',
    cwd: '/www/wwwroot/nibog',
    env: {
      NODE_ENV: 'development',
      PORT: 3111
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/root/.pm2/logs/nibog-error.log',
    out_file: '/root/.pm2/logs/nibog-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
