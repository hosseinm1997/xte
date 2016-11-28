
// Requires
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = '127.0.0.1/api'
// ----------------------------------------------------------

// Confings
chai.use(chaiHttp);
// ----------------------------------------------------------

describe('System', () => {
	// Login test
	describe('• Login a user', () => {
		it('it should not login a user without fullname field', (done) => {
			chai.request(server)
			.post('/login')
			.send({})
			.end((error, request) => {
				request.should.have.status(200);
				request.body.status.should.be.eql(1);
				done();
			});
		});
		it('it should not login a user with invalid fullname', (done) => {
			chai.request(server)
			.post('/login')
			.send({fullname:'  '})
			.end((error, request) => {
				request.should.have.status(200);
				request.body.status.should.be.eql(1);
				done();
			});
		});
		it('it should not login a user if fullname was alrady registred', (done) => {
			chai.request(server)
			.post('/login')
			.send({fullname:'online'})
			.end((error, request) => {
				request.should.have.status(200);
				request.body.status.should.be.eql(2);
				done();
			});
		});
		it('it should login a user(test) with correct fullname field', (done) => {
			chai.request(server)
			.post('/login')
			.send({fullname:'test'})
			.end((error, request) => {
				request.should.have.status(200);
				request.body.status.should.be.eql(0);
				request.body.data.should.have.property('messages').be.a('array').length.be.lte(17)
				request.body.data.should.have.property('guys').be.a('array')
				done();
			});
		});
	});
	// ----------------------------------------------------------

	// Logout test
	describe('• Logout that user', () => {
		it('it should not logout the user without fullname field', (done) => {
			chai.request(server)
			.post('/logout')
			.send({})
			.end((error, request) => {
				request.should.have.status(200);
				request.body.status.should.be.eql(1);
				done();
			});
		});
		it('it should not logout the user with invalid fullname', (done) => {
			chai.request(server)
			.post('/logout')
			.send({fullname:'  '})
			.end((error, request) => {
				request.should.have.status(200);
				request.body.status.should.be.eql(1);
				done();
			});
		});
		it('it should not logout the user if guys doesn\'t exist', (done) => {
			chai.request(server)
			.post('/logout')
			.send({fullname:'Mohammad Abas'})
			.end((error, request) => {
				request.should.have.status(200);
				request.body.status.should.be.eql(3);
				done();
			});
		});
		it('it should logout the user(test) with correct fullname field', (done) => {
			chai.request(server)
			.post('/logout')
			.send({fullname:'test'})
			.end((error, request) => {
				request.should.have.status(200);
				request.body.status.should.be.eql(0);
				done();
			});
		});
	});
	// ----------------------------------------------------------
});