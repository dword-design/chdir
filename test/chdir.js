var chdir = require('../');
var test = require('tap').test;

test('chdir', function (t) {
    t.plan(2);

    var cwd = process.cwd();
    chdir('/tmp', function () {
        t.equal(process.cwd(), '/private/tmp');
    });
    t.equal(process.cwd(), cwd);
    t.end();
});

test('nested', function (t) {
    t.plan(4);
    
    var cwd = process.cwd();
    chdir('/tmp', function () {
        t.equal(process.cwd(), '/private/tmp');
        chdir(cwd, function () {
            t.equal(process.cwd(), cwd)
        })
        t.equal(process.cwd(), '/private/tmp');
    });
    t.equal(process.cwd(), cwd);
    t.end();
});

/*test('error', function (t) {
    t.plan(4);
    
    var cwd = process.cwd();
    t.throws(
        () => chdir('/tmp', function () {
            throw new Error('foo');
        }),
        'foo'
    );
    t.equal(process.cwd(), cwd);
    t.end();
});*/
