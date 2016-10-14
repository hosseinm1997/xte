
// Requires
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = '127.0.0.1/api'
// ----------------------------------------------------------

// Confings
chai.use(chaiHttp);
// ----------------------------------------------------------

describe('Guys', () => {
	// GET guys test
	describe('• Get guys', () => {
		it('it should get all guys', (done) => {
			chai.request(server)
			.get('/guys')
			.end((error, request) => {
				request.should.have.status(200);
				request.body.status.should.be.eql(0);
				request.body.data.should.be.a('array');
				done();
			});
		});
	});
	// ----------------------------------------------------------
});