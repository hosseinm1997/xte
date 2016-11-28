
// Requires
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = '127.0.0.1/api'
// ----------------------------------------------------------

// Confings
chai.use(chaiHttp);
// ----------------------------------------------------------

describe('Messages', () => {
	// GET messages test
	describe('• Get messages', () => {
		it('it should get last 17 messages', (done) => {
			chai.request(server)
			.get('/messages')
			.end((error, request) => {
				request.should.have.status(200);
				request.body.status.should.be.eql(0);
				request.body.data.should.be.a('array');
				request.body.data.length.should.be.lte(17);
				done();
			});
		});
		it('it should get second last 17 messages', (done) => {
			chai.request(server)
			.get('/messages/2')
			.end((error, request) => {
				request.should.have.status(200);
				request.body.status.should.be.eql(0);
				request.body.data.should.be.a('array');
				request.body.data.length.should.be.lte(17);
				done();
			});
		});
	});
	// ----------------------------------------------------------

	// POST messages test
	describe('• Send a message', () => {
		it('it should not send a message without text or sender fields', (done) => {
			chai.request(server)
			.post('/messages')
			.send({text:'Hi There'})
			.end((error, request) => {
				request.should.have.status(200);
				request.body.status.should.be.eql(1);
				done();
			});
		});
		it('it should not send a message from an offline guy', (done) => {
			chai.request(server)
			.post('/messages')
			.send({sender:'offline', text:'Hi There'})
			.end((error, request) => {
				request.should.have.status(200);
				request.body.status.should.be.eql(3);
				done();
			});
		});
		it('it should send new message({sender:"online", text:"Hi There"}) with all correct fields', (done) => {
			chai.request(server)
			.post('/messages')
			.send({sender:'online', text:'Hi There'})
			.end((error, request) => {
				request.should.have.status(200);
				request.body.status.should.be.eql(0);
				request.body.data.affectedRows.should.be.eql(1);
				done();
			});
		});
		it('it should delete last message too keep database clean', (done) => {
			chai.request(server)
			.get('/dlo/messages')
			.end((error, request) => {
				request.should.have.status(200);
				request.body.status.should.be.eql(0);
				request.body.data.affectedRows.should.be.eql(1);
				done();
			});
		})
		it('it should send new persian message({sender:"online", text:"سلام به همه گی"}) with all correct fields', (done) => {
			chai.request(server)
			.post('/messages')
			.send({sender:'online', text:'سلام به همه گی'})
			.end((error, request) => {
				request.should.have.status(200);
				request.body.status.should.be.eql(0);
				request.body.data.affectedRows.should.be.eql(1);
				chai.request(server)
				.get('/messages')
				.end((error, request) => {
					request.should.have.status(200)
					request.body.status.should.be.eql(0)
					request.body.data.should.be.a('array')
					request.body.data.length.should.be.lte(17)
					request.body.data[0].sender.should.be.eql('online')
					request.body.data[0].text.should.be.eql('سلام به همه گی')
					done()
				})
			});
		});
		it('it should delete last message too keep database clean', (done) => {
			chai.request(server)
			.get('/dlo/messages')
			.end((error, request) => {
				request.should.have.status(200);
				request.body.status.should.be.eql(0);
				request.body.data.affectedRows.should.be.eql(1);
				done();
			});
		})
	});
	// ----------------------------------------------------------
});