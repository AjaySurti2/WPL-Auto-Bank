# Testing Guide: Firebase Integration

Now that the app is connected to "Actual Data" (Firebase), here is how to verify everything is working.

## 1. Local Testing
Running the app on your machine to verify connections before deploying.

1.  **Start the App** (if not running):
    ```bash
    npm run dev
    ```
2.  **Open Browser**: Go to [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal).
3.  **Test Authentication**:
    - The "Mock Users" **will no longer work** instantly unless you created them in the Firebase Console.
    - **Action**: Try to Log In with the user you created in the Firebase Console.
    - **Verify**: You should be redirected to the Dashboard.
4.  **Test Data Persistence** (The Real Test):
    - Go to **Bank Master**.
    - Click **Add Bank**.
    - Enter dummy details (e.g., "Test Bank", "1234").
    - **Refresh the Page**: Press F5.
    - **Verify**: The "Test Bank" account should **still be there**. If it stays, the Database connection is working!

## 2. Deployment Testing
Verifying the live Google Cloud application.

1.  **Deploy**:
    ```bash
    firebase deploy
    ```
2.  **Open Live URL**: The terminal will output a "Hosting URL" (e.g., `https://wpl-auto-bank.web.app`). Click it.
3.  **Repeat Tests**:
    - Login with the same credentials.
    - You should see the same data you added locally (because it's the same cloud database!).

## Troubleshooting
- **"Invalid credentials"**: Double-check the user exists in Firebase Console > Authentication.
- **"Missing or insufficient permissions"**: Check Firebase Console > Firestore Database > Rules. Ensure they verify `request.auth != null`.
- **White Screen / "Cannot read properties of undefined"**: This means your `.env.local` file is incorrect.
    - **WRONG**: `const firebaseConfig = { apiKey: ... }`
    - **CORRECT**: `VITE_FIREBASE_API_KEY=AIzaSy...` (One per line, no quotes, no spaces)
