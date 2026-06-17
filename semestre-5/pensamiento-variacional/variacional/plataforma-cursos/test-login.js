const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const EMAIL = "primomanuelsagrav@gmail.com";
const PASSWORD = "2026jmgv1983";

async function main() {
  try {
    // 1. Get Firebase Client API Key from .env.local
    const fs = require('fs');
    const env = fs.readFileSync('.env.local', 'utf-8');
    const apiKeyMatch = env.match(/NEXT_PUBLIC_FIREBASE_API_KEY=(.+)/);
    if (!apiKeyMatch) {
      console.log("No API KEY found in .env.local");
      return;
    }
    const apiKey = apiKeyMatch[1].trim().replace(/"/g, '');

    // 2. Login to Firebase Auth REST API
    const loginRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: EMAIL,
        password: PASSWORD,
        returnSecureToken: true
      })
    });
    
    const loginData = await loginRes.json();
    if (!loginData.idToken) {
      console.log("Login failed:", loginData);
      return;
    }
    
    console.log("Login successful! Got ID Token.");
    
    // 3. Make request to Vercel production API
    const res = await fetch('https://jmgvproyectosyotros.vercel.app/api/admin/grant-access', {
      headers: {
        'Authorization': `Bearer ${loginData.idToken}`
      }
    });
    
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response length:", text.length);
    
    // If it's HTML, save it to a file so we can inspect it
    if (text.startsWith('<')) {
      fs.writeFileSync('error-output.html', text);
      console.log("Saved error HTML to error-output.html");
    } else {
      console.log("Response:", text);
    }
    
  } catch (err) {
    console.error("Script error:", err);
  }
}

main();
