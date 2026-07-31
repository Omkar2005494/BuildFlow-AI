const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { initializeApp, cert, getApps, getApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'password123';

const app = getApps().length > 0 ? getApp() : initializeApp({
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  })
});
const adminAuth = getAuth(app);
const adminDb = getFirestore(app);

async function runE2E() {
  console.log("==========================================");
  console.log("Starting Firebase End-to-End Verification");
  console.log("==========================================\n");

  let idToken = '';
  let uid = '';

  try {
    console.log("1. Admin SDK Initialization:");
    console.log("   ✅ Admin SDK loaded successfully (no errors thrown).");
    
    console.log("\n2. Creating Test User via Firebase REST API...");
    const signUpRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD, returnSecureToken: true })
    });
    
    const signUpData = await signUpRes.json();
    if (!signUpRes.ok) throw new Error(signUpData.error.message);
    
    idToken = signUpData.idToken;
    uid = signUpData.localId;
    console.log(`   ✅ Test user created successfully (UID: ${uid})`);
    
    console.log("\n3. Testing ID Token Verification (Admin SDK)...");
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log("   ✅ Token verified successfully! Decoded UID:", decodedToken.uid);
    if (decodedToken.uid !== uid) throw new Error("UID mismatch!");

    console.log("\n4. Testing Protected API Route Generation (/api/generate)...");
    const apiRes = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ idea: "A simple task management app" })
    });
    
    if (apiRes.status === 401) {
      throw new Error("❌ Route returned 401 Unauthorized despite valid token.");
    }
    
    if (!apiRes.ok) {
      const err = await apiRes.json();
      throw new Error(`API Error: ${err.error}`);
    }
    
    const buildFlow = await apiRes.json();
    console.log("   ✅ API Route authenticated successfully and generated BuildFlow.");
    console.log("   ✅ Architecture:", buildFlow.architecture.name);

    console.log("\n5. Testing Firestore Writes (Saving Project)...");
    const projectId = "test-project-" + Date.now();
    const projectRef = adminDb.collection("users").doc(uid).collection("projects").doc(projectId);
    
    await projectRef.set({
      metadata: { id: projectId, name: "Test Project", description: "Test", createdAt: new Date() },
      buildFlow
    });
    console.log("   ✅ Project saved successfully to Firestore.");

    console.log("\n6. Testing Firestore Reads (Loading Project)...");
    const docSnap = await projectRef.get();
    if (!docSnap.exists) throw new Error("Project not found after saving!");
    console.log("   ✅ Project read successfully from Firestore.");
    
    console.log("\n==========================================");
    console.log("🎉 ALL E2E VERIFICATIONS PASSED!");
    console.log("==========================================\n");

  } catch (error) {
    console.error("\n❌ E2E TEST FAILED:", error);
    process.exit(1);
  } finally {
    // Cleanup
    if (uid) {
      console.log(`\nCleaning up test user (${uid})...`);
      try {
        await adminAuth.deleteUser(uid);
        console.log("✅ Test user deleted.");
      } catch (e) {
        console.error("Failed to delete test user:", e);
      }
    }
    process.exit(0);
  }
}

runE2E();
