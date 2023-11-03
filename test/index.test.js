const basicTests = require("./basic.test.js");
const destructuredDeclarationTests = require("./destructuredDeclaration.test.js");
const hocTests = require("./hoc.test.js");
const hooksTests = require("./hooks.test.js");
const mapTests = require("./map.test.js");
const renamingTests = require("./renaming.test.js");
const renderFnTests = require("./renderFn.test.js");
const ternaryTests = require("./ternary.test.js");

basicTests.run();
destructuredDeclarationTests.run();
hooksTests.run();
hocTests.run();
mapTests.run();
renamingTests.run();
renderFnTests.run();
ternaryTests.run();

console.log("All tests passed!");
