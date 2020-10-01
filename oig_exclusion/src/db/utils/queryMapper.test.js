const chai = require('chai');
const expect = chai.expect;
const queryMapper = require('./queryMapper');

it('returns a new object based on given map', () => {
  const map = {
    foo: 'tfoo',
    tar: 'ttar'
  };

  const src = {
    foo: 'foo',
    tar: 'tar'
  };

  const result = queryMapper(map, src);

  expect(result).to.eql({
    tfoo: 'foo',
    ttar: 'tar'
  });
});

it('retruns an object containing only source props', () => {
  const map = {
    foo: 'tfoo',
    tar: 'ttar'
  };

  const src = { foo: 'foo' };

  const result = queryMapper(map, src);
  expect(result).to.eql({ tfoo: 'foo' });
});

it('returns a new object xxxxx', () => {
  const map = {
    foo: 'tfoo'
  };

  const src = {
    foo: 'foo',
    tar: 'tar'
  };

  const result = queryMapper(map, src);

  expect(result).to.eql({ tfoo: 'foo' });
});

it('returns an empty object when empty source', () => {
  const map = {
    foo: 'tfoo',
    tar: 'ttar'
  };

  const result = queryMapper(map, {});
  expect(result).to.eql({});
});

it('returns an empty object when no source', () => {
  const map = {
    foo: 'tfoo',
    tar: 'ttar'
  };

  const result = queryMapper(map, undefined);
  expect(result).to.eql({});
});

it('returns an empty object when null source', () => {
  const map = {
    foo: 'tfoo',
    tar: 'ttar'
  };

  const result = queryMapper(map, null);
  expect(result).to.eql({});
});

it('returns an empty object when source is not an object', () => {
  const map = {
    foo: 'tfoo',
    tar: 'ttar'
  };

  const result = queryMapper(map, 'foo');
  expect(result).to.eql({});
});

it('throws an error when empty map', () => {
  const src = {
    foo: 'foo',
    tar: 'tar'
  };

  expect(() => {
    queryMapper({}, src);
  }).to.throw(Error);
});

it('throws an error when null map', () => {
  const src = {
    foo: 'foo',
    tar: 'tar'
  };

  expect(() => {
    queryMapper(null, src);
  }).to.throw(Error);
});

it('throws an error when undefined map', () => {
  const src = {
    foo: 'foo',
    tar: 'tar'
  };

  expect(() => {
    queryMapper(undefined, src);
  }).to.throw(Error);
});

it('throws an error when map is not an object', () => {
  const src = {
    foo: 'foo',
    tar: 'tar'
  };

  expect(() => {
    queryMapper(999, src);
  }).to.throw(Error);

  expect(() => {
    queryMapper('foo', src);
  }).to.throw(Error);

  expect(() => {
    queryMapper(true, src);
  }).to.throw(Error);
});
