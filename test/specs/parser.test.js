/* globals describe, it, expect */
const { parse } = require("../../src/parser/parser");

describe("Lezer parser", () => {
  it("parses expresions properly", () => {
    // Expression tests cases, as expression statements.
    expect(parse("const a = [1,2,3];")).toEqual({
      type: "Program",
      sourceType: "script",
      body: [
        {
          type: "VariableDeclaration",
          kind: "const",
          declarations: [
            {
              type: "VariableDeclarator",
              id: {
                type: "Identifier",
                name: "a",
              },
              init: {
                type: "ArrayExpression",
                elements: [
                  {
                    type: "Literal",
                    value: 1,
                    raw: "1",
                  },
                  {
                    type: "Literal",
                    value: 2,
                    raw: "2",
                  },
                  {
                    type: "Literal",
                    value: 3,
                    raw: "3",
                  },
                ],
              },
            },
          ],
        },
      ],
    });
  });
});
