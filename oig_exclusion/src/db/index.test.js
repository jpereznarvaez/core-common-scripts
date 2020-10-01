const chai = require('chai');
const expect = chai.expect;

const db = require('./index');

// TODO: check the function is being binded
it('sets knex.executeProduce to a function', () => {
  expect(db.executeProcedure).to.be.a('function');
});