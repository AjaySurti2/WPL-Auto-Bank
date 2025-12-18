# Firebase Data Connect Troubleshooting

## Connection Timeout Error
If you see the following error during `firebase deploy`:
`Error: Cannot setup Postgres SQL permissions of Cloud SQL database... Error: Connection terminated due to connection timeout`

This means the Firebase CLI is blocked by your corporate firewall from connecting to the Cloud SQL (Postgres) instance.

### Solution 1: Use Cloud SQL Auth Proxy (Recommended)
The Auth Proxy provides secure access to your Cloud SQL instance without needing to open firewall ports or whitelist IP addresses.

1.  **Download the Cloud SQL Auth Proxy**: [Download Link](https://cloud.google.com/sql/docs/postgres/sql-proxy#install)
2.  **Start the Proxy**:
    ```bash
    ./cloud-sql-proxy <INSTANCE_CONNECTION_NAME>
    ```
    *Note: You can find the Instance Connection Name in the Google Cloud Console or in your `dataconnect.yaml`.*
3.  **Run Deploy again**. The CLI will now use the secure tunnel established by the proxy.

### Solution 2: Partial Deployment (Workaround)
If you only need to update the Frontend (Hosting) or Firestore rules, you can skip the Data Connect deployment:

```bash
firebase deploy --only hosting,firestore
```

### Solution 3: Verify IAM Permissions
Ensure your Google account has the following roles:
*   `Cloud SQL Admin`
*   `Firebase Data Connect Admin`

### Solution 4: Whitelist Domain
Ensure your firewall allows traffic to:
*   `sqladmin.googleapis.com`
*   `firebasedataconnect.googleapis.com`
