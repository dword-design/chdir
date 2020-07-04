var chdir = require('../');
var test = require('tap').test;

test('async functions', async function (t) {
    t.plan(3);

    var cwd = process.cwd();
    await chdir('/tmp', async function () {
        t.equal(process.cwd(), '/private/tmp');
        await new Promise(resolve => setTimeout(() => { t.equal(process.cwd(), '/private/tmp'); resolve() }, 200))
    });
    t.equal(process.cwd(), cwd);
    t.end();
});
