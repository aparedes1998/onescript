const { promises: fs } = require('fs');
const { inspect } = require('util');
const { parse } = require('./parser/parser');
const { generate } = require('escodegen');

function main() {
  const result = parse('const a = Map{1 => 2, ...Map{3 => 4}}');
  console.log(generate(result));
  
  //console.log(inspect(result, false, 20));
}
main();
