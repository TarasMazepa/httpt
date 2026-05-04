function parseArgs(argv) {
  // TODO: Implement custom positional argument parsing here.
  // For now, return a dummy object to satisfy scaffolding requirements.
  return {
    command: 'run',
    file: 'dummy.httpt',
    flags: {}
  };
}

module.exports = { parseArgs };
