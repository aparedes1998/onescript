/* globals describe, it, expect */
const { inspect } = require("util");
const { parse: acornParse } = require("acorn");
const cloneRoot = require("espurify");
const { parse } = require("../../src/parser/parser");
const { describe } = require("yargs");

// TODO this super obj?.prop obj?.['prop']
const EXPSJS = `
  0 1 3.45 0.8e12 1.22e-7 0xC4f3 100n
  "" "x" "a\\t\\"." '' 'x' '<\\x12\\u1234>'
  /[0-9]+/ /\\d+/gi
  true false null NaN Infinity undefined
  +1 -2.3 !false !!true ~1 ++pre --pre post++ post--
  1+2 1-2 1*2 1/2 1%2 1**2 1<<2 1>>2 1>>>2
  1==2 1!=2 1===2 1!==2 1<2 1<=2 1>2 1>=2
  1&2 1|2 1&&2 1||2 1^2 1??2
  1?2:3 1,2
  typeof(x) void(0)
  (x)in(0) (x)instanceof(y)  
  [] [0] [3,] [0,1,2] [...'abc'] [1,2,...''] [...'',...''] [1,2,] [,,]
  {} {x:1} {null:7,} {'x':1,['y']:2}
  obj.prop obj.x.y obj['prop'] obj[0][1] obj[0].x obj.x[0]
  x=1 x+=1 x-=1 x*=1 x/=1 x**=1 x<<=2 x>>=2 x>>>=2 x&=3 x|=3 x^=3 x&&=4 x||=4 x??=4
  f() f(1) f(1,2) obj.meth() obj.meth(1,2) new\tC() new\tC(1,2)
  function(){} function\tf(x,y){} async\tfunction(){} function*(){} async\tfunction*(){}
  ()=>{} (x)=>x (x,y)=>(x+y) async()=>{}
  class{} class\tC{} class\textends\tB{} class\tC\textends\tB{}
  new\tSet() new\tSet([1,2,3,4]) new\tSet([..."abc"])
  new\tMap() new\tMap([['a',1],[3.3,true]]) new\tMap([[1,2],...(new\tMap([[3,4]]))])
`
  .trim()
  .split(/[ \n\r]+/);

const EXPS1S = `
  0 1 3.45 0.8e12 1.22e-7 0xC4f3 100n
  "" "x" "a\\t\\"." '' 'x' '<\\x12\\u1234>'
  /[0-9]+/ /\\d+/gi
  true false null NaN Infinity undefined
  +1 -2.3 !false !!true ~1 ++pre --pre post++ post--
  1+2 1-2 1*2 1/2 1%2 1**2 1<<2 1>>2 1>>>2
  1==2 1!=2 1===2 1!==2 1<2 1<=2 1>2 1>=2
  1&2 1|2 1&&2 1||2 1^2 1??2
  1?2:3 1,2
  typeof(x) void(0)
  (x)in(0) (x)instanceof(y)  
  [] [0] [3,] [0,1,2] [...'abc'] [1,2,...''] [...'',...''] [1,2,] [,,]
  {} {x:1} {null:7,} {'x':1,['y']:2}
  obj.prop obj.x.y obj['prop'] obj[0][1] obj[0].x obj.x[0]
  x=1 x+=1 x-=1 x*=1 x/=1 x**=1 x<<=2 x>>=2 x>>>=2 x&=3 x|=3 x^=3 x&&=4 x||=4 x??=4
  f() f(1) f(1,2) obj.meth() obj.meth(1,2) new\tC() new\tC(1,2)
  function(){} function\tf(x,y){} async\tfunction(){} function*(){} async\tfunction*(){}
  ()=>{} (x)=>x (x,y)=>(x+y) async()=>{}
  class{} class\tC{} class\textends\tB{} class\tC\textends\tB{}
  Set{} Set{1,2,3,4} Set{..."abc"}
  Map{} Map{'a'=>1,3.3=>true} Map{1=>2,...Map{3=>4}}
`
  .trim()
  .split(/[ \n\r]+/);

const STMTSJS = `
  return(1); throw(x);
  let\tx; let\tx=1; const\tx=1;
  if(1)x=1;
  if(1)x=0;else{x=1;}
  while(0){} while(0){continue;} while(0){break;} do{}while(0);
  for(;;){} for(let\tx=0;;){} for(let\tx=0;x<7;){} for(let\tx=0;x<7;x++){}
  for(x\tin\ty){} for(x\tof\ty){}
  try{}catch(e){} try{}catch{} try{}finally{} try{}catch{}finally{}
  with(x){} debugger;
  class\tC{} class\tC\textends\tB{}
`
  .trim()
  .split(/[ \n\r]+/);

const STMTS1S = `
  return(1); throw(x);
  var\tx; var\tx=1; const\tx=1;
  if(1)x=1;
  if(1)x=0;else{x=1;}
  while(0){} while(0){continue;} while(0){break;} do{}while(0);
  for(;;){} for(var\tx=0;;){} for(var\tx=0;x<7;){} for(var\tx=0;x<7;x++){}
  for(x\tin\ty){} for(x\tof\ty){}
  try{}catch(e){} try{}catch{} try{}finally{} try{}catch{}finally{}
  with(x){} debugger;
  class\tC{} class\tC\textends\tB{}
`
  .trim()
  .split(/[ \n\r]+/);

const testCase = (test) => {
  const expected = cloneRoot(acornParse(`${test}`, { ecmaVersion: 2021 }));
  let received;
  try {
    received = cloneRoot(parse(`${test}`));
  } catch (error) {
    throw new Error(
      `Lezer failed!\n${test}\n\n${inspect(expected, false, 10)}\n\n${error}`
    );
  }
  expect(received).toEqual(expected);
};

const testCaseExps = (jscode, oscode) => {
  for (let i = 0; i < oscode.length; i++) {
    const expected = cloneRoot(
      acornParse(`(${jscode[i]});`, { ecmaVersion: 2021 })
    );
    let received;
    try {
      received = cloneRoot(parse(`(${oscode[i]});`));
    } catch (error) {
      throw new Error(
        `Lezer failed!\n(${oscode[i]});\n\n${inspect(
          expected,
          false,
          10
        )}\n\n${error}`
      );
    }
    expect(received).toEqual(expected);
  }
};

const testCaseStmts = (jscode, oscode) => {
  for (let i = 0; i < oscode.length; i++) {
    const expected = cloneRoot(
      acornParse(`function _() {${jscode[i]}}`, { ecmaVersion: 2021 })
    );
    let received;
    try {
      received = cloneRoot(parse(`function _() {${oscode[i]}}`));
    } catch (error) {
      throw new Error(
        `Lezer failed!\nfunction _() {${oscode[i]}}\n\n${inspect(
          expected,
          false,
          10
        )}\n\n${error}`
      );
    }
    expect(received).toEqual(expected);
  }
};

describe("Lezer parser", () => {
  it("parses expresions properly", () => {
    // Expression tests cases, as expression statements.
    testCaseExps(EXPSJS, EXPS1S);
  });

  it("parses statements properly", () => {
    testCaseStmts(STMTSJS, STMTS1S);
  });

  it("parses yield statements properly", () => {
    ["yield x;", "yield* x;"]
      .map((stmt) => `function* _() {${stmt}}`)
      .forEach(testCase);
  });

  it("parses async statements properly", () => {
    ["await x;", "for\tawait(x\tof\ty){}"]
      .map((stmt) => `async function _() {${stmt}}`)
      .forEach(testCase);
  });
});
describe(":/", () => {
  it("parses async statements properly", () => {
    expect(true).toEqual(true);
  });
});
