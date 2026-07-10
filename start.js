/**
 * Start Script — Seeding database then starting server
 * seed-readdy.js uses INSERT OR REPLACE so it is idempotent — safe to always run.
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const dbPath = path.join(__dirname, 'cms/database/db.sqlite');

async function runSeed() {
  console.log('🗃️ Running database seeder (idempotent — safe to always run)...');
  const seedProcess = spawn('node', ['cms/database/seed-readdy.js'], { stdio: 'inherit', shell: true });
  
  await new Promise((resolve, reject) => {
    seedProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Database seeding (readdy) completed.');
        resolve();
      } else {
        reject(new Error(`Database seeding (readdy) failed with exit code: ${code}`));
      }
    });
  });

  console.log('📰 Running news seeder...');
  const newsProcess = spawn('node', ['cms/database/seed-news-daiphuc.js'], { stdio: 'inherit', shell: true });
  
  await new Promise((resolve, reject) => {
    newsProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ News seeding completed successfully.');
        resolve();
      } else {
        reject(new Error(`News seeding failed with exit code: ${code}`));
      }
    });
  });

  console.log('📦 Running products seeder...');
  const productsProcess = spawn('node', ['cms/database/seed-products-daiphuc.js'], { stdio: 'inherit', shell: true });
  
  await new Promise((resolve, reject) => {
    productsProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Products seeding completed successfully.');
        resolve();
      } else {
        reject(new Error(`Products seeding failed with exit code: ${code}`));
      }
    });
  });
}

async function run() {
  await runSeed();

  console.log('🚀 Launching Express Server...');
  // Require and start the server
  require('./cms/server.js');
}

run().catch((err) => {
  console.error('❌ Failed to start application:', err);
  process.exit(1);
});

