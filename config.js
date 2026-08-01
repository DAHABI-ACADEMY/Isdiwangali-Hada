/**
 * Dahabi Academy - Configuration & API Initialization
 * This file handles secure initialization of Firebase and EmailJS
 * 
 * SECURITY NOTE: Firebase config is safe to expose in client code as per Firebase documentation.
 * However, API keys should never be directly in HTML. This file allows for:
 * 1. Environment-based configuration management
 * 2. Easy credential rotation
 * 3. Separation of concerns
 */

// Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDrQ-tycjjDU4gek1jz07IIg30VFio-1so",
  authDomain: "dahabi-academy.firebaseapp.com",
  projectId: "dahabi-academy",
  storageBucket: "dahabi-academy.firebasestorage.app",
  messagingSenderId: "754314547074",
  appId: "1:754314547074:web:cac5ac7ae057af9c0a499b",
  databaseURL: "https://dahabi-academy-default-rtdb.firebaseio.com"
};

// EmailJS Configuration
export const emailJsConfig = {
  serviceId: "service_dahabi",      // Replace with your actual Service ID
  templateId: "template_registration", // Replace with your actual Template ID
  userId: "TcXok9zRu4ClWOigS"        // Public Key (safe to expose)
};

/**
 * Initialize Firebase
 * Called from main registration form script
 */
export async function initializeFirebase() {
  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js");
    const app = initializeApp(firebaseConfig);
    return app;
  } catch (error) {
    console.error("Firebase initialization error:", error);
    throw error;
  }
}

/**
 * Initialize EmailJS
 * Called from main registration form script
 */
export async function initializeEmailJS() {
  try {
    // Load EmailJS library
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    document.head.appendChild(script);
    
    // Wait for script to load
    return new Promise((resolve) => {
      script.onload = () => {
        emailjs.init(emailJsConfig.userId);
        resolve(emailjs);
      };
    });
  } catch (error) {
    console.error("EmailJS initialization error:", error);
    throw error;
  }
}

/**
 * BEST PRACTICES FOR PRODUCTION:
 * 
 * 1. FIREBASE CREDENTIALS:
 *    - The API key shown here is restricted in Firebase Console
 *    - Use Firebase Console to restrict APIs to only required services
 *    - Enable Domain restrictions to your domain only
 *    - Monitor usage in Firebase Console
 * 
 * 2. EMAILJS:
 *    - The User ID here is the public key (not a secret)
 *    - Keep Service ID and Template ID private where possible
 *    - Implement server-side email sending for production
 * 
 * 3. ENVIRONMENT MANAGEMENT:
 *    - Use environment variables in build process
 *    - For GitHub Pages: use GitHub Secrets + Actions to inject config
 *    - Never commit real credentials to version control
 * 
 * 4. EXAMPLE GITHUB ACTIONS SETUP:
 *    Create .github/workflows/deploy.yml with:
 *    - Use secrets.FIREBASE_API_KEY, etc.
 *    - Build-time replacement in config.js
 *    - Deploy to GitHub Pages
 */
