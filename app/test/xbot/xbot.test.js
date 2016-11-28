
// Requires
var chai = require('chai')
var chaiHttp = require('chai-http')
var should = chai.should()
var server = '127.0.0.1/api'
// ----------------------------------------------------------

// Confings
chai.use(chaiHttp)
// ----------------------------------------------------------

describe('xbot', () => {
	// xbot root command test
	describe('• Call root command', () => {
		it('it should describe itself', (done) => {
			chai.request(server)
			.post('/messages')
			.send({sender:'online', text:'@x'})
			.end((error, request) => {
				request.should.have.status(200)
				request.body.status.should.be.eql(0)
				chai.request(server)
				.get('/messages')
				.end((error, request) => {
					request.should.have.status(200)
					request.body.status.should.be.eql(0)
					request.body.data.should.be.a('array')
					request.body.data.length.should.be.lte(17)
					request.body.data[0].sender.should.be.eql('xbot')
					request.body.data[0].text.should.be.String
					done()
				})
			})
		})
	})
	// ----------------------------------------------------------

	// ask xbot test
	describe('• Ask a its name', () => {
		it('it should give its name', (done) => {
			chai.request(server)
			.post('/messages')
			.send({sender:'online', text:'@x اسمت چیه'})
			.end((error, request) => {
				request.should.have.status(200)
				request.body.status.should.be.eql(0)
				chai.request(server)
				.get('/messages')
				.end((error, request) => {
					request.should.have.status(200)
					request.body.status.should.be.eql(0)
					request.body.data.should.be.a('array')
					request.body.data.length.should.be.lte(17)
					request.body.data[0].sender.should.be.eql('xbot')
					request.body.data[0].text.should.be.String
					done()
				})
			})
		})
		it('it should delete last 4 messages too keep data base clean', (done) => {
			chai.request(server)
			.get('/dlo/messages')
			.end((error, request) => {
				request.should.have.status(200);
				request.body.status.should.be.eql(0);
				request.body.data.affectedRows.should.be.eql(1);
				chai.request(server)
				.get('/dlo/messages')
				.end((error, request) => {
					request.should.have.status(200);
					request.body.status.should.be.eql(0);
					request.body.data.affectedRows.should.be.eql(1);
					chai.request(server)
					.get('/dlo/messages')
					.end((error, request) => {
						request.should.have.status(200);
						request.body.status.should.be.eql(0);
						request.body.data.affectedRows.should.be.eql(1);
						chai.request(server)
						.get('/dlo/messages')
						.end((error, request) => {
							request.should.have.status(200);
							request.body.status.should.be.eql(0);
							request.body.data.affectedRows.should.be.eql(1);
							done()
						});
					});
				});
			});
		})
	})
	// ----------------------------------------------------------
});
