module.exports = {
    apps: [
        {
            name: 'honey-badger',
            script: './dist/main.js',
            watch: true,
            env: {
                COMMON_VARIABLE: 'true',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],

    deploy: {
        production: {
            user: 'root',
            host: ['chtoma.com'],
            port: '22',
            ref: 'origin/master',
            repo: 'git@github.com:sxlwar/honey-badger.git',
            path: '/blog',
            ssh_options: 'StrictHostKeyChecking=no',
            env: {
                NODE_ENV: 'production',
            },
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
        },
    },
};
