function emitCommand(file, flags) {
  // TODO: Handle the --target <curl|fetch> flag
  console.log(`[emit] Executing on file: ${file} with flags: ${JSON.stringify(flags)}`);
}

module.exports = emitCommand;
