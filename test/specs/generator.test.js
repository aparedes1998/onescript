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
    expect(
      generate(
        parse(
          "Map{1 => 2, ...Map{3 => 4}, 5 => 35, ...Map{5 => 8}, ...Map{10 => 11}}"
        ),
        { format: FORMAT_MINIFY }
      )
    ).toBe(
      "new Map([[1,2],...new Map([[3,4]]),[5,35],...new Map([[5,8]]),...new Map([[10,11]])])"
    );
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
    expect(
      generate(parse('Set{..."abc", 5, 6, ..."def", 4}'), {
        format: FORMAT_MINIFY,
      })
    ).toBe("new Set([...'abc',5,6,...'def',4])");
  });

  it("Testing comma operator", () => {
    expect(() => parse("var x = 1, y = 2;")).toThrow();
    expect(() => parse("const x = (f(33), g(7,7));")).toThrow();
    expect(() => parse("x, y = [1,2]")).toThrow();
  });

  it("Testing function", () => {
    expect(() =>
      parse("const f = function (x, y) {return x + y; };")
    ).toThrow();
    expect(() =>
      parse("const f = function f(x, y) {return x + y; };")
    ).not.toThrow();
    expect(() => parse("x, y = [1,2]")).toThrow();
    expect(generate(parse("function f(x, y){}"))).toBe(
      "const f = function f(x, y) {\n};"
    );
  });

  it("Testing var to let", () => {
    expect(
      generate(parse("var f = [1,2,3,4];"), { format: FORMAT_MINIFY })
    ).toBe("let f=[1,2,3,4]");
  });
});
