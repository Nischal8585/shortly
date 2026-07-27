# Local Wi-Fi QR Code Testing

This guide explains how to test Shortly's QR Code generation and redirection features on a physical mobile device (e.g. a smartphone) during local development.

---

## Purpose

QR Codes generated during development contain the fully qualified target URL derived from `VITE_BASE_URL`.

Since local IP addresses change dynamically between different Wi-Fi networks (or when restarting your router), developers must update this environment configuration variable whenever their local IP changes. This ensures that a mobile device scanning the QR code resolves the address of the development machine rather than loopback connections on itself.

---

## Step 1 — Find Your Current Local IP Address

To route traffic to your development computer, you need to find its current local IP address on the Wi-Fi interface:

### macOS
Open Terminal and run:
```bash
ipconfig getifaddr en0
```
Example Output:
```text
192.168.0.111
```

If your machine is connected via a wired Ethernet interface, run:
```bash
ipconfig getifaddr en1
```

---

## Step 2 — Update Environment Variables

Open the frontend environment file at `frontend/.env`.

### Local Desktop Development (Recommended)

When developing and testing on the same computer, use:

```env
VITE_API_URL=http://localhost:5001/api
VITE_BASE_URL=http://<YOUR_LOCAL_IP>:5001
```

### Mobile / LAN Testing

When accessing the frontend from another device (e.g. phone or tablet) on the same Wi-Fi network, update both variables to use your machine's local IP address:

```env
VITE_API_URL=http://<YOUR_LOCAL_IP>:5001/api
VITE_BASE_URL=http://<YOUR_LOCAL_IP>:5001
```

### Example Configuration

**Desktop Development**

```env
VITE_API_URL=http://localhost:5001/api
VITE_BASE_URL=http://192.168.0.111:5001
```

**Mobile / LAN Testing**

```env
VITE_API_URL=http://192.168.0.111:5001/api
VITE_BASE_URL=http://192.168.0.111:5001
```

### Understanding Variable Responsibilities

- **`VITE_API_URL`**: Base URL used by the frontend to communicate with backend API endpoints (e.g. authentication, dashboard, analytics, link management). Use `localhost` when the frontend runs on the same machine as the backend. Use your local IP address when testing from another device on the same network.

- **`VITE_BASE_URL`**: Public base URL used to generate short links and QR codes. During local development and LAN testing, this should always point to your machine's local IP address so generated links are accessible from other devices on the network.
---

## Step 3 — Restart the Development Server

After modifying the `.env` file, restart the development server to ensure Vite reads the updated configurations during startup:

```bash
npm run dev
```

Vite reads environment variables only during compile-time startup. A hard restart of the processes is required.

---

## Step 4 — Generate a New QR Code

1. Open the Shortly Dashboard in your browser.
2. Select a link or create a new one, then click the **QR Code** action button in the list.
3. Verify that the generated QR Code Preview Modal now displays:
   `http://<YOUR_LOCAL_IP>:5001/<shortCode>` (e.g. `http://192.168.0.111:5001/appleshortly`)
   instead of:
   `http://localhost:5001/<shortCode>`

---

## Step 5 — Verify Local Network Connectivity

1. Before scanning the QR Code, open the generated short URL directly in the browser on your development machine (e.g., `http://192.168.0.111:5001/appleshortly`) to confirm the server redirects correctly.
2. Connect your mobile phone and development machine to the **same Wi-Fi network**.
3. Open the Dashboard on your phone by navigating to Vite's exposed local network IP (e.g., `http://192.168.0.111:5173`).
4. Click the QR Code row action to open the modal, and scan the QR code using your phone's camera.
5. Confirm that the phone redirects successfully to the original destination URL.

---

## Troubleshooting

### QR Code still contains `localhost`
*   **Cause A**: `VITE_BASE_URL` is empty in `frontend/.env`. Check that the environment variable has a value.
*   **Cause B**: Vite was not restarted after saving changes in `.env`. Stop the terminal processes and run `npm run dev` again.
*   **Cause C**: An old QR Code was loaded. Dismiss the modal and open it again to refresh the SVG render block.

### Phone cannot connect ("Website can't be reached")
*   **Cause A**: The devices are on different Wi-Fi networks or subnets (e.g. one is on a Guest network, or a VPN is active on the computer). Disconnect the VPN and confirm matching SSIDs.
*   **Cause B**: The local IP address has changed. Re-run `ipconfig getifaddr en0` and verify the value in `.env` is current.
*   **Cause C**: The backend server is not running or listening on port `5001`.
*   **Cause D**: macOS Firewall is blocking incoming connections. Go to **System Settings > Network > Firewall > Options** and check that incoming Node connections are allowed.

---

## Lessons Learned

*   **Predictable URL Resolution**: Centralizing URL generation inside a single helper (`getShortUrl()`) made it easy to audit and solve network routing errors.
*   **Deterministic Configuration**: Explicitly defining `VITE_BASE_URL` in the environment keeps deployment, staging, and development behaviors deterministic, rather than relying on dynamic origin or port replacement hacks.
*   **Environment Parity**: Application code is only as correct as its surrounding environment variables. Configuring networks and firewalls correctly is critical when building production-ready software.
