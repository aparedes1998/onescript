#!/usr/bin/env node

const fs = require("fs");
const { inspect } = require("util");
const { parse } = require("./parser/parser");
const { generate, FORMAT_MINIFY } = require("escodegen");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const prompt = require("prompt-sync")();

function logFile(fileName, content) {
  if (fileName) {
    fs.writeFileSync(fileName, content + "\n", "utf8");
  }
}

function main() {
  let source;
  let output;

  const argv = yargs(hideBin(process.argv))
    .option("source", {
      alias: "s",
      type: "string",
      description: "Run with source logging",
    })
    .option("output", {
      alias: "o",
      type: "string",
      description: "Run with output logging",
    })
    .option("log", {
      type: "string",
      description: "Run with output logging",
    })
    .parse();

  if (argv.source) {
    source = fs.readFileSync(argv.source, "utf-8");
  } else {
    source = prompt("");
  }

  let logFileName;
  if (argv.log) {
    logFileName = argv.log;
  }

  const parsedResult = parse(source, logFileName);
  let result;
  let generateCode = true;

  if (argv.ast && parsedResult) {
    fs.writeFileSync(
      "output.json",
      JSON.stringify(parsedResult, null, 4),
      "utf8"
    );
    if (!argv.output) {
      generateCode = false;
    }
  }

  if (generateCode) {
    if (argv.minify) {
      try {
        logFile(logFileName, "Starting code generation (minified)", "utf8");
        result = generate(parsedResult, { format: FORMAT_MINIFY });
        logFile(logFileName, "Finished code generation (minified)", "utf8");
      } catch (error) {
        if (logFileName) {
          logFile(logFileName, error.stack.toString());
        }
        throw error;
      }
    } else {
      logFile(logFileName, "Starting code generation", "utf8");
      result = generate(parsedResult);
      logFile(logFileName, "Finished code generation", "utf8");
    }

    if (argv.output) {
      output = argv.output;
    } else {
      console.log(result);
    }
  }

  if (output) {
    fs.writeFileSync(output, result, "utf8");
  }
}

if (require.main === module) {
  main();
}
