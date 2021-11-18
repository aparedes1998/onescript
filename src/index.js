const { promises: fs } = require('fs');
const { inspect } = require('util');
const { parse } = require('./parser/parser');
const { generate } = require('escodegen');

function main() {
  const result = parse('const a = Set{1, 2, 3, 4} ');
  console.log(generate(result));
  //console.log(inspect(result, false, 10));
}
main();
