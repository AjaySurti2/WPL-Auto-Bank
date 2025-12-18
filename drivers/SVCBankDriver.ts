import { BankDriver, BankSelectors, smartLogin, smartNavigateToStatements, smartSelectAccount, simulateHumanTyping } from '../utils/automation';

export class SVCBankDriver implements BankDriver {
    name = "SVC Co-Operative Bank";
    baseUrl = "https://netbankingpib.svcbank.com/PIB/DefaultPages/Login.aspx";

    // Selectors are still useful for the 'Smart' functions to know WHERE to look, 
    // but we rely less on strict IDs for everything.
    selectors: BankSelectors = {
        login: {
            usernameField: "input[name*='LoginId']",
            passwordField: "input[type='password']",
            submitButton: "input[value='Log In']",
        },
        navigation: {
            accountsMenu: "a:has-text('Accounts')",
            statementsLink: "a[href*='DetailedStatement.aspx']"
        },
        statement: {
            accountSelect: "select[name*='ddlAccount']",
            fromDate: "input[name*='txtFromDate']",
            toDate: "input[name*='txtToDate']",
            downloadButton: "input[value='Proceed']",
            formatSelect: "img[src*='xls']"
        }
    };

    /**
     * Step 1: Login
     * Uses Smart Login heuristic: Click -> Type -> Tab -> Repeat
     */
    async login(credentials: { user: string, pass: string }): Promise<void> {
        console.log(`[${this.name}] Starting Smart Login...`);
        // Uses the configured selectors but applies the "Human Typing" and "Tab" logic automatically
        await smartLogin(
            this.selectors.login.usernameField,
            this.selectors.login.passwordField,
            credentials
        );
    }

    /**
     * Step 2: Navigate to "Detailed Statement"
     * Uses Smart Navigation heuristic to find 'Statement' links
     */
    async navigateToStatements(): Promise<void> {
        console.log(`[${this.name}] Smart Navigating...`);

        // 1. Try Heuristic Scan first
        const success = await smartNavigateToStatements();

        // 2. Fallback to specific Sidebar click if heuristic fails (because it's inside a menu)
        if (!success) {
            console.log("Heuristic nav failed (likely hidden in menu). Using explicit path.");
            const accountsMenu = document.querySelector(this.selectors.navigation.accountsMenu) as HTMLElement;
            if (accountsMenu) {
                accountsMenu.click();
                await new Promise(r => setTimeout(r, 500));
                const stmtLink = document.querySelector(this.selectors.navigation.statementsLink) as HTMLElement;
                if (stmtLink) stmtLink.click();
            }
        }
    }

    /**
     * Step 3: Configure Download
     * Uses Smart Account Select to find the account number in dropdowns/lists
     */
    async downloadStatement(accountNumber: string, fromDate: string, toDate: string): Promise<void> {
        console.log(`[${this.name}] Smart Configuring Download...`);

        // 1. Smart Select Account (checks Dropdowns OR Text Matches)
        await smartSelectAccount(accountNumber);

        // 2. Set Dates (Smart logic not needed for dates usually, just typing)
        const fromInput = document.querySelector(this.selectors.statement.fromDate) as HTMLInputElement;
        const toInput = document.querySelector(this.selectors.statement.toDate) as HTMLInputElement;

        if (fromInput) await simulateHumanTyping(fromInput, fromDate);
        if (toInput) await simulateHumanTyping(toInput, toDate);

        // 3. Proceed & Download
        // Note: For complex multi-step downloads (Proceed -> Wait -> Excel), 
        // specific driver logic is still best, but we use the 'selectors' map to keep it clean.
        const proceedBtn = document.querySelector(this.selectors.statement.downloadButton) as HTMLElement;
        if (proceedBtn) {
            proceedBtn.click();
            await new Promise(r => setTimeout(r, 2000));
        }

        const excelIcon = document.querySelector(this.selectors.statement.formatSelect!) as HTMLElement;
        if (excelIcon) excelIcon.click();
    }
}
