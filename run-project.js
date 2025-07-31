#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('========================================');
console.log('    RideMatch Development Server');
console.log('========================================');
console.log('');

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('Installing dependencies...');
    const install = spawn('npm', ['install'], { stdio: 'inherit' });
    install.on('close', (code) => {
        if (code !== 0) {
            console.error('Failed to install dependencies');
            process.exit(1);
        }
        startServer();
    });
} else {
    startServer();
}

function startServer() {
    console.log('Starting development server...');
    console.log('Server will be available at: http://localhost:3000');
    console.log('Press Ctrl+C to stop the server');
    console.log('');

    // Try multiple methods to start the server
    const methods = [
        () => spawn('npm', ['run', 'dev'], { stdio: 'inherit' }),
        () => spawn('npx', ['next', 'dev'], { stdio: 'inherit' }),
        () => spawn('node', [path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next'), 'dev'], { stdio: 'inherit' })
    ];

    function tryMethod(index) {
        if (index >= methods.length) {
            console.error('All methods failed to start the server');
            process.exit(1);
        }

        const child = methods[index]();
        
        child.on('error', (err) => {
            console.log(`Method ${index + 1} failed, trying next...`);
            tryMethod(index + 1);
        });

        child.on('close', (code) => {
            if (code !== 0) {
                console.log(`Method ${index + 1} exited with code ${code}, trying next...`);
                tryMethod(index + 1);
            }
        });
    }

    tryMethod(0);
} 