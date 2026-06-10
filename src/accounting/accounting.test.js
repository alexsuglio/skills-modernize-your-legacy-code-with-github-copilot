const { DataProgram, Operations, runMenuLoop } = require("./index");

function runSession(choices, amounts = []) {
  const outputs = [];
  let choiceIndex = 0;
  let amountIndex = 0;

  const io = {
    readMenuChoice() {
      if (choiceIndex >= choices.length) {
        return 4;
      }
      return choices[choiceIndex++];
    },
    readAmount() {
      if (amountIndex >= amounts.length) {
        return 0;
      }
      return amounts[amountIndex++];
    },
    writeLine(message) {
      outputs.push(message);
    },
  };

  const dataProgram = new DataProgram();
  const operations = new Operations(dataProgram);
  runMenuLoop(operations, io);

  return { outputs, dataProgram, operations };
}

describe("COBOL-equivalent accounting business logic", () => {
  test("TC-001: Application launch and menu rendering", () => {
    const { outputs } = runSession([4]);

    expect(outputs).toContain("Account Management System");
    expect(outputs).toContain("1. View Balance");
    expect(outputs).toContain("2. Credit Account");
    expect(outputs).toContain("3. Debit Account");
    expect(outputs).toContain("4. Exit");
  });

  test("TC-002: Initial account balance value", () => {
    const { outputs } = runSession([1, 4]);

    expect(outputs).toContain("Current balance: 001000.00");
  });

  test("TC-003: View balance does not modify account", () => {
    const { outputs } = runSession([1, 1, 4]);
    const balances = outputs.filter((line) => line.startsWith("Current balance:"));

    expect(balances).toEqual(["Current balance: 001000.00", "Current balance: 001000.00"]);
  });

  test("TC-004: Credit account with valid amount", () => {
    const { outputs } = runSession([2, 1, 4], [250.5]);

    expect(outputs).toContain("Amount credited. New balance: 001250.50");
    expect(outputs).toContain("Current balance: 001250.50");
  });

  test("TC-005: Debit account with sufficient funds", () => {
    const { outputs } = runSession([3, 1, 4], [200.0]);

    expect(outputs).toContain("Amount debited. New balance: 000800.00");
    expect(outputs).toContain("Current balance: 000800.00");
  });

  test("TC-006: Debit account with insufficient funds", () => {
    const { outputs } = runSession([3, 1, 4], [1200.0]);

    expect(outputs).toContain("Insufficient funds for this debit.");
    expect(outputs).toContain("Current balance: 001000.00");
  });

  test("TC-007: Debit exact available balance", () => {
    const { outputs } = runSession([3, 1, 4], [1000.0]);

    expect(outputs).toContain("Amount debited. New balance: 000000.00");
    expect(outputs).toContain("Current balance: 000000.00");
  });

  test("TC-008: Debit after zero balance", () => {
    const { outputs } = runSession([3, 3, 1, 4], [1000.0, 0.01]);

    expect(outputs).toContain("Amount debited. New balance: 000000.00");
    expect(outputs).toContain("Insufficient funds for this debit.");
    expect(outputs).toContain("Current balance: 000000.00");
  });

  test("TC-009: Sequential transaction persistence in one session", () => {
    const { outputs } = runSession([2, 3, 1, 4], [300.0, 125.25]);

    expect(outputs).toContain("Amount credited. New balance: 001300.00");
    expect(outputs).toContain("Amount debited. New balance: 001174.75");
    expect(outputs).toContain("Current balance: 001174.75");
  });

  test("TC-010: Invalid menu option handling", () => {
    const { outputs } = runSession([9, 4]);

    expect(outputs).toContain("Invalid choice, please select 1-4.");
    expect(outputs).toContain("Account Management System");
  });

  test("TC-011: Exit flow", () => {
    const { outputs } = runSession([4]);

    expect(outputs).toContain("Exiting the program. Goodbye!");
  });

  test("TC-012: Credit zero amount", () => {
    const { outputs } = runSession([2, 1, 4], [0.0]);

    expect(outputs).toContain("Amount credited. New balance: 001000.00");
    expect(outputs).toContain("Current balance: 001000.00");
  });

  test("TC-013: Debit zero amount", () => {
    const { outputs } = runSession([3, 1, 4], [0.0]);

    expect(outputs).toContain("Amount debited. New balance: 001000.00");
    expect(outputs).toContain("Current balance: 001000.00");
  });

  test("TC-014: Data reset on new process start", () => {
    const firstSession = runSession([2, 4], [50.0]);
    const secondSession = runSession([1, 4]);

    expect(firstSession.outputs).toContain("Amount credited. New balance: 001050.00");
    expect(secondSession.outputs).toContain("Current balance: 001000.00");
  });
});
