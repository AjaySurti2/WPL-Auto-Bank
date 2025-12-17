# WPL Auto Bank

Automated Bank Statement Downloader & Analyzer for Wellknown Polyesters Limited.

## Documentation
- **[Process Document](docs/process_document.md)**: Overview of how the application works, workflows, and architecture.
- **[Manual Setup Guide](docs/manual_setup.md)**: Instructions for setting up the Firebase backend.
- **[Testing Guide](docs/testing_guide.md)**: How to verify the application locally and in production.
- **[Firewall Whitelist](docs/firewall_whitelist.md)**: Network requirements for corporate IT.

## Quick Start (Local)
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Setup Environment**:
    - Copy `.env.example` to `.env.local`.
    - Fill in Firebase config values.
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Deployment
This project is configured for **Firebase Hosting**.
```bash
npm run build
firebase deploy
```
