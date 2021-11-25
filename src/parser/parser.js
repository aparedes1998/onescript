const { inspect } = require("util");
const { parser: lezerParser } = require("./lezer-parser");
const processors = require("./processors");
const fs = require("fs");

function buildESTree(cursor, input) {
  const { name, from, to } = cursor;
  const args = [];
  if (cursor.firstChild()) {
    do {
      const arg = buildESTree(cursor, input);
      args.push(arg);
    } while (cursor.nextSibling());
    cursor.parent();
  } else {
    args.push(input.substring(from, to));
  }
  const processor = processors[name];
  if (processor) {
    // AST node
    return processor(...args);
  }
  if (args.length === 1 && name === args[0]) {
    // Token
    return name;
  }
  throw new SyntaxError(`Cannot process ${name}! Args: ${inspect(args)}`);
}

function logFile(fileName, content) {
  if (fileName) {
    fs.writeFileSync(fileName, content + "\n", "utf8");
  }
}

function parse(source, logFileName) {
  try {
    logFile(logFileName, "Starting parse process");
    const tree = lezerParser.parse(source);
    logFile(logFileName, "Parsing process finished sucessfully");
    logFile(logFileName, "Starting building tree process");
    const cursor = tree.cursor();
    const esTree = buildESTree(cursor, source);
    logFile(logFileName, "Finished building tree sucessfully");
    return esTree;
  } catch (error) {
    if (logFileName) {
      logFile(logFileName, error.stack.toString());
    }
    throw error;
  }
}

module.exports = {
  parse,
};
