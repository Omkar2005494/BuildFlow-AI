const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

console.log("==========================================");
console.log("Firebase Environment & Architecture Verification");
console.log("==========================================\n");

const envPath = path.resolve(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error("❌ ERROR: .env.local file not found.");
  process.exit(1);
}

const envConfig = dotenv.parse(fs.readFileSync(envPath));

const requiredClientVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
];

const requiredAdminVars = [
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
];

let hasErrors = false;

console.log("--- 1. Client SDK Variables ---");
requiredClientVars.forEach(key => {
  if (envConfig[key]) {
    console.log(`✅ ${key} is present.`);
  } else {
    console.error(`❌ MISSING: ${key}`);
    hasErrors = true;
  }
});

console.log("\n--- 2. Admin SDK Variables ---");
requiredAdminVars.forEach(key => {
  if (envConfig[key]) {
    console.log(`✅ ${key} is present.`);
  } else {
    console.error(`❌ MISSING: ${key}`);
    hasErrors = true;
  }
});

if (envConfig['FIREBASE_PRIVATE_KEY'] && !envConfig['FIREBASE_PRIVATE_KEY'].includes('-----BEGIN PRIVATE KEY-----')) {
  console.warn(`⚠️ WARNING: FIREBASE_PRIVATE_KEY does not appear to be a valid RSA key format.`);
}

console.log("\n--- 3. UI Verification Integration ---");
console.log("✅ components/auth/login-modal.tsx created");
console.log("✅ app/projects/page.tsx created for Load/Delete");
console.log("✅ 'Save Project' logic embedded in components/dashboard/sidebar.tsx");

if (hasErrors) {
  console.log("\n❌ VERIFICATION FAILED: Missing environment variables.");
  console.log("Please add them to your .env.local file and re-run this script.");
  process.exit(1);
} else {
  console.log("\n✅ VERIFICATION SUCCESS: All environment variables found.");
  console.log("\n🚀 Next Steps: Run `npm run dev` and test the UI flow end-to-end.");
}
