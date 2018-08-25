import test from 'ava';

// examples

test('my passing test', t => {
  t.pass();
});

test('resolves with 3', t => {
  t.plan(1);

  return Promise.resolve(3).then(n => {
    t.is(n, 3);
  });
});


test.cb('invokes callback', t => {
  t.plan(1);

  // some async function
  new Promise (() => {
    t.pass();
    t.end();
  });
});

const fn = async () => Promise.resolve('foo');

test('show how to async', async (t) => {
	t.is(await fn(), 'foo');
});