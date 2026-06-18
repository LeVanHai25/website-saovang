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
          console.log('✅ Base seeding completed.');
          resolve();
        } else {
          reject(new Error(`Base seeding failed with exit code: ${code}`));
        }
      });
    });

    console.log('🗃️ Upgrading database with 15 premium projects...');
    const upgradeProcess = spawn('node', ['cms/database/reset-db-content.js'], { stdio: 'inherit', shell: true });
    await new Promise((resolve, reject) => {
      upgradeProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Premium projects seeded successfully.');
          resolve();
        } else {
          reject(new Error(`Premium seeding failed with exit code: ${code}`));
        }
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
