/**
 * Start Script — Seeding database if not exists, then starting server
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const dbPath = path.join(__dirname, 'cms/database/db.sqlite');

async function run() {
  if (!fs.existsSync(dbPath)) {
    console.log('🗃️ Database not found. Seeding database first...');
    // run seed.js
    const seedProcess = spawn('node', ['cms/database/seed.js'], { stdio: 'inherit', shell: true });
    
    await new Promise((resolve, reject) => {
      seedProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Seeding completed successfully.');
          resolve();
        } else {
          reject(new Error(`Seeding failed with exit code: ${code}`));
        }
      });
      seedProcess.on('error', (err) => {
        reject(err);
      });
    });
  } else {
    console.log('🗃️ Database found. Skipping seed...');
  }

  console.log('🚀 Launching Express Server...');
  // Require and start the server
  require('./cms/server.js');
}

run().catch((err) => {
  console.error('❌ Failed to start application:', err);
  process.exit(1);
});
