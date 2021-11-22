const { promises: fs } = require('fs');
const { inspect } = require('util');
const { parse } = require('./parser/parser');
const { generate } = require('escodegen');

function main() {
  const result = parse('var x = 24');
  console.log(generate(result));
  
  //console.log(inspect(result, false, 20));
}
main();

