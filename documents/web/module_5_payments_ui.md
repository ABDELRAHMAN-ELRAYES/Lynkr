# Module 5: Payments & Escrow - Web GUI Specification

## 1. Overview
Trust and Security are paramount. The UI must look **impeccable, secure, and precise**.

## 2. System Pages (Enhanced)

| Page ID | Page Name | UX Goal |
|---|---|---|
| PAY-001 | Checkout | Trustworthy, seamless payment entry |
| PAY-002 | Wallet / History | Clear financial tracking |

---

## 3. High-Fidelity Details

### PAY-001: Checkout / Secure Pay
*   **Layout**:
    *   **Trust Header**: "Secure Checkout" with Lock Icon and "Stripe" logo subtle grayscale.
*   **Payment Method**:
    *   **Visual Credit Card**: When user types, a CSS-rendered credit card flips and updates the numbers/name in real-time. (Premium touch).
    *   **Saved Cards**: Display as "Mastercard ending 4242" with the Mastercard logo.
*   **Order Summary (Sticky Right)**:
    *   Breakdown of fees with a "Tooltip" `(i)` explaining the Service Fee.

### PAY-003: Withdrawal
*   **Money Animation**:
    *   "Available to Withdraw": Huge font.
    *   When "Withdraw" is clicked, show a "Bank Transfer" animation (Money flying into bank icon).
    *   Show "Estimated Arrival: [Date]" dynamically.

---

## 4. Micro-Interactions
*   **Button States**:
    *   `Pay Now`: On click, text changes to spinner. On success, button morphs into a Green Checkmark Circle and ripples outward.
    *   Redirect occurs *after* the success animation completes (1.5s delay for satisfaction).
*   **Copying Data**:
    *   Clicking a Transaction ID copies it to clipboard and shows "Copied!" tooltip.

---

## 5. Premium UI Touches
*   **Invoices**:
    *   Auto-generated PDF design.
    *   "Download Invoice" button uses a "File Down" icon animation.
*   **Zero States**: If wallet is empty, show a "piggy bank" illustration.
