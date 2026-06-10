const prompt = require("prompt-sync")({ sigint: true });

const MENU_SEPARATOR = "--------------------------------";
const OP_TOTAL = "TOTAL ";
const OP_CREDIT = "CREDIT";
const OP_DEBIT = "DEBIT ";

// Mirrors COBOL DataProgram: in-memory account storage with READ/WRITE operations.
class DataProgram {
  constructor() {
    this.storageBalance = 1000.0;
  }

  execute(operation, balance) {
    if (operation === "READ") {
      return this.storageBalance;
    }

    if (operation === "WRITE") {
      this.storageBalance = balance;
      return this.storageBalance;
    }

    return this.storageBalance;
  }
}

// Mirrors COBOL Operations module and preserves operation code flow.
class Operations {
  constructor(dataProgram) {
    this.dataProgram = dataProgram;
    this.finalBalance = 1000.0;
  }

  execute(operationType, io) {
    if (operationType === OP_TOTAL) {
      this.finalBalance = this.dataProgram.execute("READ", this.finalBalance);
      io.writeLine(`Current balance: ${formatBalance(this.finalBalance)}`);
      return;
    }

    if (operationType === OP_CREDIT) {
      io.writeLine("Enter credit amount: ");
      const amount = io.readAmount();
      this.finalBalance = this.dataProgram.execute("READ", this.finalBalance);
      this.finalBalance += amount;
      this.dataProgram.execute("WRITE", this.finalBalance);
      io.writeLine(`Amount credited. New balance: ${formatBalance(this.finalBalance)}`);
      return;
    }

    if (operationType === OP_DEBIT) {
      io.writeLine("Enter debit amount: ");
      const amount = io.readAmount();
      this.finalBalance = this.dataProgram.execute("READ", this.finalBalance);

      if (this.finalBalance >= amount) {
        this.finalBalance -= amount;
        this.dataProgram.execute("WRITE", this.finalBalance);
        io.writeLine(`Amount debited. New balance: ${formatBalance(this.finalBalance)}`);
      } else {
        io.writeLine("Insufficient funds for this debit.");
      }
    }
  }
}

function showMenu(writeLine) {
  writeLine(MENU_SEPARATOR);
  writeLine("Account Management System");
  writeLine("1. View Balance");
  writeLine("2. Credit Account");
  writeLine("3. Debit Account");
  writeLine("4. Exit");
  writeLine(MENU_SEPARATOR);
}

function formatBalance(value) {
  const sign = value < 0 ? "-" : "";
  const absolute = Math.abs(value);
  const fixed = absolute.toFixed(2);
  const [intPart, decimalPart] = fixed.split(".");
  const paddedInt = intPart.padStart(6, "0");
  return `${sign}${paddedInt}.${decimalPart}`;
}

function createCliIO() {
  return {
    readMenuChoice() {
      const value = prompt("Enter your choice (1-4): ");
      return Number.parseInt(String(value).trim(), 10);
    },
    readAmount() {
      const value = prompt("");
      const parsed = Number.parseFloat(String(value).trim());
      return Number.isFinite(parsed) ? parsed : 0;
    },
    writeLine(message) {
      console.log(message);
    },
  };
}

function runMenuLoop(operations, io) {
  let continueFlag = "YES";

  while (continueFlag !== "NO") {
    showMenu(io.writeLine);
    const userChoice = io.readMenuChoice();

    switch (userChoice) {
      case 1:
        operations.execute(OP_TOTAL, io);
        break;
      case 2:
        operations.execute(OP_CREDIT, io);
        break;
      case 3:
        operations.execute(OP_DEBIT, io);
        break;
      case 4:
        continueFlag = "NO";
        break;
      default:
        io.writeLine("Invalid choice, please select 1-4.");
    }
  }

  io.writeLine("Exiting the program. Goodbye!");
}

function main() {
  const dataProgram = new DataProgram();
  const operations = new Operations(dataProgram);
  const io = createCliIO();
  runMenuLoop(operations, io);
}

if (require.main === module) {
  main();
}

module.exports = {
  DataProgram,
  Operations,
  formatBalance,
  runMenuLoop,
  constants: {
    OP_TOTAL,
    OP_CREDIT,
    OP_DEBIT,
  },
};
