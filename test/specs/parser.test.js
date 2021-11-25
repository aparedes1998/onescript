/* globals describe, it, expect */
const { parse } = require("../../src/parser/parser");

describe("Lezer parser", () => {
  it("Check parser trees", () => {
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

    expect(parse("Map{'a'=> 1, 3.3 => true}")).toEqual({
      type: "Program",
      sourceType: "script",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "NewExpression",
            callee: {
              type: "Identifier",
              name: "Map",
            },
            arguments: [
              {
                type: "ArrayExpression",
                elements: [
                  {
                    type: "ArrayExpression",
                    elements: [
                      {
                        type: "Literal",
                        value: "a",
                        raw: "'a'",
                      },
                      {
                        type: "Literal",
                        value: 1,
                        raw: "1",
                      },
                    ],
                  },
                  {
                    type: "ArrayExpression",
                    elements: [
                      {
                        type: "Literal",
                        value: 3.3,
                        raw: "3.3",
                      },
                      {
                        type: "Literal",
                        value: true,
                        raw: "true",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    });

    expect(parse('Set{..."abc", 5, 6, ..."def", 4}')).toEqual({
      type: "Program",
      sourceType: "script",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "NewExpression",
            callee: {
              type: "Identifier",
              name: "Set",
            },
            arguments: [
              {
                type: "ArrayExpression",
                elements: [
                  {
                    type: "SpreadElement",
                    argument: {
                      type: "Literal",
                      value: "abc",
                      raw: '"abc"',
                    },
                  },
                  {
                    type: "Literal",
                    value: 5,
                    raw: "5",
                  },
                  {
                    type: "Literal",
                    value: 6,
                    raw: "6",
                  },
                  {
                    type: "SpreadElement",
                    argument: {
                      type: "Literal",
                      value: "def",
                      raw: '"def"',
                    },
                  },
                  {
                    type: "Literal",
                    value: 4,
                    raw: "4",
                  },
                ],
              },
            ],
          },
        },
      ],
    });
    expect(parse("function f(x, y){}")).toEqual({
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
                name: "f",
              },
              init: {
                id: {
                  type: "Identifier",
                  name: "f",
                },
                params: [
                  {
                    type: "Identifier",
                    name: "x",
                  },
                  {
                    type: "Identifier",
                    name: "y",
                  },
                ],
                body: {
                  type: "BlockStatement",
                  body: [],
                },
                generator: false,
                async: false,
                type: "FunctionExpression",
              },
            },
          ],
        },
      ],
    });
    expect(parse("var f = [1,2,3,4];")).toEqual({
      type: "Program",
      sourceType: "script",
      body: [
        {
          type: "VariableDeclaration",
          kind: "let",
          declarations: [
            {
              type: "VariableDeclarator",
              id: {
                type: "Identifier",
                name: "f",
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
                  {
                    type: "Literal",
                    value: 4,
                    raw: "4",
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
