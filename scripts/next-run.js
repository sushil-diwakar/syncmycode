const { spawn } = require('child_process');
const { join } = require('path');
const fs = require('fs');

const command = process.argv[2] || 'dev';

const envPath = join(__dirname, '..', '.env');
let port = '3000';

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/^PORT\s*=\s*(\d+)/m);
    if (match) {
        port = match[1];
    }
}

console.log(`Running next ${command} on port ${port}...`);
const child = spawn('next', [command, '-p', port], {
    stdio: 'inherit',
    cwd: join(__dirname, '..'),
    shell: process.platform === 'win32',
});

child.on('exit', (code) => process.exit(code));
