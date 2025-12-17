# Firewall Whitelist Requirements for AutoBank (Firebase)

To allow the AutoBank application to connect to the Google Firebase backend from within the corporate network, please whitelist the following domains on **Port 443 (HTTPS)**.

## Primary Services (Essential)
These domains are required for Authentication and Database connectivity.

- **`firestore.googleapis.com`** (Database read/write)
- **`identitytoolkit.googleapis.com`** (User Login/Auth)
- **`securetoken.googleapis.com`** (Auth Token Refresh)
- **`accounts.google.com`** (Google Sign-in services)

## Broad Whitelist (Recommended)
If your firewall supports wildcard domains, whitelisting these is the most robust solution to prevent future issues.

- **`*.googleapis.com`** (All Google APIs)
- **`*.firebaseio.com`** (Legacy DB & Signaling)
- **`*.firebaseapp.com`** (Backend hosting)

## Ports
- **TCP Port 443** (Outgoing HTTPS)
- **TCP Port 80** (HTTP - mostly for initial redirects, but 443 is critical)

## Protocol
- **HTTPS / WebSockets**: The application uses "Long Polling" and "WebSockets" over HTTPS. Ensure **WebSockets** are not blocked for `firestore.googleapis.com`.
