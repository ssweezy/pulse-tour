module.exports = {
  apps: [{
    name: 'payload-cms',
    script: '.next/standalone/server.js',
    interpreter: 'node',
    cwd: '/var/www/payload',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: '/var/www/payload/logs/pm2-error.log',
    out_file: '/var/www/payload/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000
  }]
}
