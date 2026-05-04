#!/usr/bin/env node

const { parseArgs } = require('./parser');
const hydrateCommand = require('./commands/hydrate');
const parseCommand = require('./commands/parse');
const emitCommand = require('./commands/emit');
const runCommand = require('./commands/run');

function main() {
  const { command, file, flags } = parseArgs(process.argv);

  switch (command) {
    case 'hydrate':
      hydrateCommand(file, flags);
      break;
    case 'parse':
      parseCommand(file, flags);
      break;
    case 'emit':
      emitCommand(file, flags);
      break;
    case 'run':
      runCommand(file, flags);
      break;
    default:
      console.log(`Unknown command: ${command}`);
      process.exit(1);
  }
}

main();
