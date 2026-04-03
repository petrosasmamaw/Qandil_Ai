#!/usr/bin/env node
/**
 * Kill all processes on ports 3000, 3001, 3002
 * Usage: node kill-ports.js
 */

const { exec } = require('child_process');
const os = require('os');

const ports = [3000, 3001, 3002];

function killPorts() {
  if (os.platform() === 'win32') {
    // Windows
    console.log('🔍 Finding processes on ports 3000, 3001, 3002...\n');
    
    exec('netstat -ano', (err, stdout, stderr) => {
      if (err) {
        console.error('Error running netstat:', err);
        return;
      }

      const lines = stdout.split('\n');
      const pids = new Set();

      lines.forEach(line => {
        ports.forEach(port => {
          if (line.includes(`:${port}`) && line.includes('LISTENING')) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && !isNaN(pid)) {
              pids.add(pid);
            }
          }
        });
      });

      if (pids.size === 0) {
        console.log('✅ No processes found on ports 3000, 3001, 3002');
        return;
      }

      console.log(`📋 Found ${pids.size} process(es) to kill:`);
      pids.forEach(pid => console.log(`   PID: ${pid}`));
      console.log('\n⏳ Killing processes...\n');

      let killed = 0;
      pids.forEach(pid => {
        exec(`taskkill /PID ${pid} /F`, (err, stdout, stderr) => {
          if (err) {
            console.log(`❌ Failed to kill PID ${pid}`);
          } else {
            console.log(`✅ Killed PID ${pid}`);
            killed++;
            if (killed === pids.size) {
              console.log(`\n✨ Successfully killed ${killed} process(es)!`);
              verifyPorts();
            }
          }
        });
      });
    });
  } else {
    // Unix/Linux/Mac
    console.log('🔍 Finding processes on ports 3000, 3001, 3002...\n');
    
    exec(`lsof -i :3000 -i :3001 -i :3002 -t`, (err, stdout, stderr) => {
      if (err || !stdout.trim()) {
        console.log('✅ No processes found on ports 3000, 3001, 3002');
        return;
      }

      const pids = stdout.trim().split('\n').filter(pid => pid);
      console.log(`📋 Found ${pids.length} process(es) to kill:`);
      pids.forEach(pid => console.log(`   PID: ${pid}`));
      console.log('\n⏳ Killing processes...\n');

      pids.forEach(pid => {
        exec(`kill -9 ${pid}`, (err, stdout, stderr) => {
          if (err) {
            console.log(`❌ Failed to kill PID ${pid}`);
          } else {
            console.log(`✅ Killed PID ${pid}`);
          }
        });
      });

      setTimeout(() => {
        console.log('\n✨ Done! Ports should now be free.\n');
      }, 1000);
    });
  }
}

function verifyPorts() {
  console.log('\n🔍 Verifying ports are free...\n');
  
  exec('netstat -ano', (err, stdout, stderr) => {
    if (err) return;

    let portsInUse = false;
    ports.forEach(port => {
      if (stdout.includes(`:${port}`)) {
        console.log(`⚠️  Port ${port} still in use`);
        portsInUse = true;
      } else {
        console.log(`✅ Port ${port} is FREE`);
      }
    });

    if (!portsInUse) {
      console.log('\n🎉 All ports (3000, 3001, 3002) are FREE and ready to use!\n');
    }
  });
}

killPorts();
