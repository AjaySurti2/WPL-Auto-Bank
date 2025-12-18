# Automation Strategy: The Driver Pattern

## 1. The Challenge
Every bank website is different.
*   **Account Selection:** Some use dropdowns, others use cards/grids.
*   **Statement Page:** Some have a direct link, others require navigating menus.
*   **Download:** Some download immediately, others open a preview first.
*   **Security:** Dynamic IDs, anti-bot scripts, and varying OTP flows.

## 2. The Solution: Driver Architecture
Instead of one giant script with `if (bank == 'HDFC')`, we use a **Modular Driver Pattern**.
Each bank has its own "Definition File" that implements a standard interface. The Core Engine loads the correct driver and executes standardized commands.

### Architecture Overview
1.  **Core Engine (`utils/automation.ts`)**:
    *   Handles the browser instance (Puppeteer/Playwright).
    *   Provides helper functions (`simulateHumanTyping`, `smartClick`, `waitFor`).
    *   Manages the overall workflow (Login -> Navigate -> Download).

2.  **Bank Drivers (`drivers/*.ts`)**:
    *   Contains the specific **CSS Selectors** for that bank.
    *   Implements the specific logic for **Login**, **Navigation**, and **Download**.

## 3. Recommended Workflow

### Step 1: Login (Dynamic)
*   **Action**: Use `smartLogin(userSelector, passSelector, creds)`.
*   **Logic**:
    1.  Locate Username field -> **Click** -> **Type (200ms delay)** -> **Tab**.
    2.  Locate Password field -> **Click** -> **Type (200ms delay)**.
    3.  Auto-find "Login" button if selectors not provided.

### Step 2: Smart Account Selection
*   **Action**: Use `smartSelectAccount(accountNumber)`.
*   **Logic**:
    *   **Strategy A (Dropdown)**: Iterates `<options>` looking for a partial match of the Account Number.
    *   **Strategy B (Cards/Text)**: Scans the DOM (XPath) for the Account Number text and clicks the container.

### Step 3: Heuristic Navigation
*   **Action**: Use `smartNavigateToStatements()`.
*   **Logic**: XPath scan for links containing **"Statement"**, **"History"**, or **"Activity"**.
    *   *Fallback*: If Heuristic fails (e.g., hidden in a menu), the Driver executes a specific click path defined in its selectors.

### Step 4: Search & Filter
*   **Action**: Set "From Date" and "To Date".
*   **Logic**: Use `simulateHumanTyping` for dates if date-pickers are restrictive.

### Step 5: Download
*   **Action**: Find the "Download" button (CSV/PDF).
*   **Logic**: Handle "Popups" or "New Tabs" if the bank opens the statement in a new window.

## 4. Code Structure Plan
We will refactor `utils/automation.ts` to define this Interface.
