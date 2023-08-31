const basicTests = require("./basic.test.js");
const hocTests = require("./hoc.test.js");
const hooksTests = require("./hooks.test.js");
const mapTests = require("./map.test.js");
const renderFnTests = require("./renderFn.test.js");

basicTests.run();
hooksTests.run();
hocTests.run();
mapTests.run();
renderFnTests.run();

console.log("All tests passed!");
