// --- Automation Interfaces ---

export interface BankSelectors {
    login: {
        usernameField: string;
        passwordField: string;
        submitButton: string;
        otpInput?: string;
    };
    navigation: {
        accountsMenu: string;
        statementsLink: string;
    };
    statement: {
        accountSelect: string;
        fromDate: string;
        toDate: string;
        downloadButton: string;
        formatSelect?: string; // e.g., 'PDF' or 'CSV'
    };
}

export interface BankDriver {
    name: string;
    baseUrl: string;
    selectors: BankSelectors;

    /**
     * Executes the login flow using human-like typing.
     * Should handle CAPTCHA pauses if necessary.
     */
    login(credentials: { user: string, pass: string }): Promise<void>;

    /**
     * Navigates to the statement download page.
     */
    navigateToStatements(): Promise<void>;

    /**
     * Selects account, sets dates, and triggers download.
     */
    downloadStatement(accountNumber: string, fromDate: string, toDate: string): Promise<void>;
}

// --- Helper Functions ---

/**
 * Automation Utilities for creating human-like interactions.
 * Useful for bypassing bot detection or copy-paste restrictions on bank portals.
 */

/**
 * Simulates human-like typing into an HTML Input element.
 * 
 * Behavior:
 * 1. Clears the field.
 * 2. Types character-by-character with random delays.
 * 3. Triggers 'input' and 'change' events for React/Framework compatibility.
 * 4. Triggers 'blur' at the end to commit the value.
 * 
 * @param element The target HTMLInputElement
 * @param text The text to type
 * @param minDelay Minimum delay between keystrokes (ms) - Default 50ms
 * @param maxDelay Maximum delay between keystrokes (ms) - Default 200ms
 */
export const simulateHumanTyping = async (
    element: HTMLInputElement,
    text: string,
    minDelay: number = 50,
    maxDelay: number = 200
): Promise<void> => {

    // 1. Focus the element
    element.focus();

    // 2. Clear the field (simulating select all + delete or just setting empty)
    // We set value to empty string and trigger events so React registers the clear
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    if (nativeInputValueSetter) {
        nativeInputValueSetter.call(element, '');
    } else {
        element.value = '';
    }
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));

    await new Promise(r => setTimeout(r, minDelay));

    // 3. Type character-by-character
    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        // Append char to current value
        const currentValue = element.value;
        const newValue = currentValue + char;

        // Use native setter to ensure React Controlled Components update correctly
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(element, newValue);
        } else {
            element.value = newValue;
        }

        // Trigger events that a real keystroke would
        element.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, inputType: 'insertText', data: char }));
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true })); // Some forms rely on this
        // Note: 'keydown', 'keypress', 'keyup' are complex to simulate perfectly trusted events, 
        // but 'input' is usually sufficient for modern frameworks.

        // 4. Random Delay
        const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        await new Promise(r => setTimeout(r, delay));
    }

    // 5. Trigger Blur (Tab out)
    element.dispatchEvent(new Event('blur', { bubbles: true }));
};

// --- Smart Heuristics (Dynamic Automation) ---

/**
 * 1. Smart Login: "Focus -> Type -> Tab -> Repeat"
 * Generic login flow that works on most simple forms.
 */
export const smartLogin = async (
    usernameSelector: string,
    passwordSelector: string,
    credentials: { user: string, pass: string }
): Promise<void> => {

    // Username
    const userField = document.querySelector(usernameSelector) as HTMLInputElement;
    if (userField) {
        userField.click(); // Explicit click as requested
        await simulateHumanTyping(userField, credentials.user, 100, 200); // 200ms max delay
        // Simulate Tab press logic (focus next usually happens manually or via script, but we blur)
    } else {
        console.warn(`SmartLogin: Username field '${usernameSelector}' not found.`);
    }

    // Password
    const passField = document.querySelector(passwordSelector) as HTMLInputElement;
    if (passField) {
        passField.click();
        await simulateHumanTyping(passField, credentials.pass, 100, 200);
    } else {
        console.warn(`SmartLogin: Password field '${passwordSelector}' not found.`);
    }

    // Attempt to auto-find submit button if not provided
    const submitBtn = document.querySelector("button[type='submit'], input[type='submit'], button:has-text('Login'), button:has-text('Sign In')") as HTMLElement;
    if (submitBtn) {
        await new Promise(r => setTimeout(r, 500)); // Pause before click
        submitBtn.click();
    }
};

/**
 * 2. Smart Navigation: "Scan for 'Statement' or 'History'"
 * Uses XPath to find visible text nodes containing keywords.
 */
export const smartNavigateToStatements = async (): Promise<boolean> => {
    const keywords = ['Account Statement', 'Statement', 'Transaction History', 'Account Activity', 'Detailed Statement'];

    for (const word of keywords) {
        // XPath to find elements containing the text, case-insensitive logic often needed but keeping simple for now
        // This finds <a>, <button>, or <span> with the text
        const xpath = `//a[contains(text(), '${word}')] | //button[contains(text(), '${word}')] | //span[contains(text(), '${word}')]`;
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const element = result.singleNodeValue as HTMLElement;

        if (element && element.offsetParent !== null) { // Check visibility
            console.log(`SmartNavigation: Found link matching '${word}'. Clicking...`);
            element.click();
            return true;
        }
    }
    console.warn("SmartNavigation: No statement links found via heuristics.");
    return false;
};

/**
 * 3. Smart Account Selection: "Dropdown vs List vs Table"
 * Locates the account number text in various containers and interacts accordingly.
 */
export const smartSelectAccount = async (accountNumber: string): Promise<boolean> => {
    // Strategy A: Check Dropdowns (<select>)
    const selects = document.querySelectorAll('select');
    for (const select of selects) {
        for (let i = 0; i < select.options.length; i++) {
            // Match last 4 digits or full number
            if (select.options[i].text.includes(accountNumber) || select.options[i].value.includes(accountNumber)) {
                console.log("SmartSelect: Found in Dropdown.");
                select.selectedIndex = i;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                return true;
            }
        }
    }

    // Strategy B: Clickable Elements (Cards/Lists)
    // Find any element containing the Account Number text
    const xpath = `//*[contains(text(), '${accountNumber}')]`;
    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0; i < result.snapshotLength; i++) {
        let el = result.snapshotItem(i) as HTMLElement;
        // Walk up to find a clickable container (button, a, or div with onclick) if the text itself isn't clickable
        // For simplicity, we try clicking the element itself or its immediate parent
        if (el.tagName === 'OPTION') continue; // Handled by Strategy A

        console.log("SmartSelect: Found in DOM text. Attempting click.");
        el.click(); // Try clicking text
        if (el.parentElement) el.parentElement.click(); // Try clicking parent card
        return true;
    }

    console.warn(`SmartSelect: Account ${accountNumber} not found.`);
    return false;
};
