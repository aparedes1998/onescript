const { parse } = require("../../src/parser/parser");
const { generate, FORMAT_MINIFY } = require("escodegen");

describe("Escodegen generator", () => {
  it("Testing onescript Map", () => {
    // Expression tests cases, as expression statements.
    expect(generate(parse("Map{}"))).toBe("new Map();");
    expect(
      generate(parse("Map{'a'=> 1, 3.3 => true}"), { format: FORMAT_MINIFY })
    ).toBe("new Map([['a',1],[3.3,true]])");
    expect(
      generate(parse("Map{1 => 2, ...Map{3 => 4}}"), { format: FORMAT_MINIFY })
    ).toBe("new Map([[1,2],...new Map([[3,4]])])");
  });

  it("Testing onescript Set", () => {
    // Expression tests cases, as expression statements.
    expect(generate(parse("Set{}"))).toBe("new Set();");
    expect(generate(parse("Set{1, 2, 3, 4}"), { format: FORMAT_MINIFY })).toBe(
      "new Set([1,2,3,4])"
    );
    expect(generate(parse('Set{..."abc"}'), { format: FORMAT_MINIFY })).toBe(
      "new Set([...'abc'])"
    );
  });

  it("Testing comma operator", () => {
    expect(() => parse("var x = 1, y = 2;")).toThrow();
  });
});
