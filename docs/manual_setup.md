# Firebase Manual Setup Instructions

> [!IMPORTANT]
> Please perform these steps while logged in as the project administrator.

## 1. Create Firebase Project
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add project"** or **"Create a project"**.
3.  Enter a name (e.g., `wpl-auto-bank`).
4.  Toggle **Google Analytics** (Optional, recommended off for simplicity).
5.  Click **"Create Project"**.

## 2. Enable Authentication
1.  In your new project dashboard, click **"Build"** > **"Authentication"** in the left sidebar.
2.  Click **"Get started"**.
3.  Select **"Email/Password"** as a Sign-in provider.
4.  **Enable** the "Email/Password" switch (leave "Email link" disabled).
5.  Click **"Save"**.
6.  Go to the **"Users"** tab and click **"Add user"**.
7.  Create an initial admin user (e.g., `admin@wellknown.com` / `password123`).

## 3. Enable Firestore Database
1.  Click **"Build"** > **"Firestore Database"** in the left sidebar.
2.  Click **"Create database"**.
3.  Select a **Location** (e.g., `asia-south1` for Mumbai).
4.  Start in **Test mode** (for easier development) or **Production mode**.
5.  Click **"Create"**.

## 4. Get Configuration
1.  Click the **Gear icon** (Project settings) next to "Project Overview".
2.  Scroll down to the "Your apps" section.
3.  Click the **Web** icon (`</>`).
4.  Register the app with a nickname (e.g., `AutoBank Web`).
5.  Check "Also set up **Firebase Hosting** for this app".
6.  Click **"Register app"**.
7.  **COPY** the `firebaseConfig` object values to your local `.env` file.
