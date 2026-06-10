# COBOL Student Account Test Plan

This test plan validates the current COBOL business logic before and during migration to Node.js. It is designed for business stakeholder walkthroughs and later automation mapping.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | Application launch and menu rendering | Application compiled and executable available | 1. Start application.<br>2. Observe first screen. | Menu is displayed with options 1 View Balance, 2 Credit Account, 3 Debit Account, 4 Exit. | TBD | TBD | Baseline UI flow in console. |
| TC-002 | Initial account balance value | Fresh application run | 1. Start application.<br>2. Enter choice 1. | Current balance is shown as 001000.00 (starting value 1000.00). | TBD | TBD | Confirms initial business state. |
| TC-003 | View balance does not modify account | Fresh application run | 1. Enter choice 1.<br>2. Enter choice 1 again. | Both balance outputs are identical when no credit/debit occurred. | TBD | TBD | Read-only behavior validation. |
| TC-004 | Credit account with valid amount | Fresh application run | 1. Enter choice 2.<br>2. Enter amount 250.50.<br>3. Enter choice 1. | System confirms credit and new balance is 001250.50. Balance inquiry returns same value. | TBD | TBD | Positive credit flow. |
| TC-005 | Debit account with sufficient funds | Fresh application run | 1. Enter choice 3.<br>2. Enter amount 200.00.<br>3. Enter choice 1. | System confirms debit and new balance is 000800.00. Balance inquiry returns same value. | TBD | TBD | Positive debit flow. |
| TC-006 | Debit account with insufficient funds | Fresh application run | 1. Enter choice 3.<br>2. Enter amount 1200.00.<br>3. Enter choice 1. | System displays insufficient funds message. Stored balance remains 001000.00. | TBD | TBD | Overdraw protection rule. |
| TC-007 | Debit exact available balance | Fresh application run | 1. Enter choice 3.<br>2. Enter amount 1000.00.<br>3. Enter choice 1. | Debit is accepted. New balance is 000000.00. | TBD | TBD | Boundary condition for debit rule. |
| TC-008 | Debit after zero balance | Start from zero balance state (run TC-007 first) | 1. Enter choice 3.<br>2. Enter amount 0.01.<br>3. Enter choice 1. | System displays insufficient funds message. Balance remains 000000.00. | TBD | TBD | Confirms no negative balances. |
| TC-009 | Sequential transaction persistence in one session | Fresh application run | 1. Enter choice 2 and amount 300.00.<br>2. Enter choice 3 and amount 125.25.<br>3. Enter choice 1. | Balance reflects both operations: 001174.75. | TBD | TBD | Validates read/write sequence integrity. |
| TC-010 | Invalid menu option handling | Application running at menu prompt | 1. Enter choice 9. | System displays invalid choice message and returns to menu loop. | TBD | TBD | Input guard at menu level. |
| TC-011 | Exit flow | Application running at menu prompt | 1. Enter choice 4. | Continue flag is set to stop loop, goodbye message is shown, process exits normally. | TBD | TBD | End-of-session behavior. |
| TC-012 | Credit zero amount | Fresh application run | 1. Enter choice 2.<br>2. Enter amount 0.00.<br>3. Enter choice 1. | Credit completes without error and balance remains 001000.00. | TBD | TBD | Current implementation behavior check. |
| TC-013 | Debit zero amount | Fresh application run | 1. Enter choice 3.<br>2. Enter amount 0.00.<br>3. Enter choice 1. | Debit completes without error and balance remains 001000.00. | TBD | TBD | Current implementation behavior check. |
| TC-014 | Data reset on new process start | Complete any successful credit or debit, then exit app | 1. In session A, change balance (credit or debit).<br>2. Exit app.<br>3. Start session B.<br>4. Enter choice 1. | Balance restarts at 001000.00 in new process because storage is in program working storage, not persistent DB. | TBD | TBD | Important for migration scope and stakeholder sign-off. |

## Notes For Node.js Migration

- Each test case can become an automated scenario in unit and integration suites.
- TC-004 to TC-009 map directly to core business service logic tests.
- TC-010 and TC-011 map to CLI/controller behavior tests.
- TC-014 should be revisited if persistent storage is introduced in Node.js, because expected behavior will change.
