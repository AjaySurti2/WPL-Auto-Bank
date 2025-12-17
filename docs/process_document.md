# WPL Auto Bank - Process Document

## Overview
WPL Auto Bank is an automation tool designed to streamline the downloading of bank statements. It manages bank credentials, schedules automatic downloads (simulated), and handles OTP challenges securely.

## Core Workflows

### 1. Bank Configuration (Bank Master)
- **Objective**: Store connection details for each bank account.
- **Process**:
    1.  User enters Bank Name, Portal URL, Credentials, and OTP preference.
    2.  System saves this to the **Firestore Database**.
    3.  **Security**: Credentials are stored in the database (Note: Production should encryption).

### 2. Statement Scheduling (Scheduler)
- **Objective**: Define when and where files should be downloaded.
- **Process**:
    1.  User selects a Bank Account.
    2.  User sets frequency (Daily/Weekly) and Time.
    3.  User selects a **Local Directory** path (e.g., `C:/Finance/Statements`).
        *   *Note: Web browsers cannot write directly to disk without user permission. In a full desktop app (Electron), this would be automated.*

### 3. Action Center & OTP Handling
- **Objective**: Handle 2FA/OTP challenges during login.
- **Process**:
    1.  The Automation Engine (simulated backend) attempts to log in.
    2.  If OTP is required, the status changes to `OTP_REQUIRED`.
    3.  The **Action Center** notifies the user.
    4.  User enters the OTP code.
    5.  System verifies OTP and proceeds to download.

### 4. Manual Download
- **Objective**: Trigger immediate downloads for specific banks.
- **Process**:
    1.  User selects banks in the Dashboard.
    2.  Clicks "Download Selected".
    3.  System logs the request and simulates the download process, updating the "Last Sync" timestamp.

### 5. AI Insights
- **Objective**: Analyze financial data.
- **Process**:
    1.  Downloaded PDF statements are parsed.
    2.  Google Gemini AI analyzes the transaction text.
    3.  Insights types (Expenses, Anomalies) are displayed.

## System Architecture
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Google Firebase (Firestore + Auth)
- **Deployment**: Localhost (currently) or Firebase Hosting
