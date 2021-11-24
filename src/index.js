#!/usr/bin/env node

const { promises: fs } = require("fs");
const { inspect } = require("util");
const { parse } = require("./parser/parser");
const { generate, FORMAT_MINIFY } = require("escodegen");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { argv } = require("process");
const prompt = require("prompt-sync")();

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
    source = argv.source;
  } else {
    source = prompt("Escriba su código a continuación: ");
  }

  const parsedResult = parse(source);
  let result;
  let generateCode = true;

  if (argv.ast) {
    fs.writeFile(
      "output.json",
      JSON.stringify(parsedResult, null, 4),
      "utf8",
      (err) => {
        if (err) {
          return console.log(err);
        }
        console.log("Generated output.json successfully");
      }
    );
    if (!argv.output) {
      generateCode = false;
    }
  }

  if (argv.minify && generateCode) {
    result = generate(parsedResult, { format: FORMAT_MINIFY });
  } else {
    result = generate(parsedResult);
  }

  if (argv.output && generateCode) {
    output = argv.output;
  } else {
    console.log(result);
  }

  if (argv.log) {
    // Loggear cosas
  }

  if (output) {
    fs.writeFile(output, result, "utf8", (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("Generated output.js successfully");
    });
  }
  //console.log(generate(result));
  //console.log(inspect(result, false, 20));
}
//main();

if (require.main === module) {
  main();
}
