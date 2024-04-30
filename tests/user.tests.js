//require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app'); // assuming your app file is in the root directory

chai.use(chaiHttp);

describe('User API', () => {
  describe('GET /me', () => {
    it('should retrieve user details', (done) => {
      chai
        .request(app)
        .get('/me')
        .set('Authorization', 'Bearer valid_access_token') // assuming valid access token
        .end((err, res) => {
          expect(res).to.have.status(200);
          // Add more expectations based on the response format
          done();
        });
    });
  });

  describe('PUT /me', () => {
    it('should update user details', (done) => {
      chai
        .request(app)
        .put('/me')
        .set('Authorization', 'Bearer valid_access_token') // assuming valid access token
        .send({ username: 'new_username', email: 'new@example.com', password: 'newpassword' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('msg').equal('Updated successfully!');
          done();
        });
    });

    it('should not update user details if password is unchanged', (done) => {
      chai
        .request(app)
        .put('/me')
        .set('Authorization', 'Bearer valid_access_token') // assuming valid access token
        .send({ username: 'new_username', email: 'new@example.com', password: 'samepassword' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('msg').equal('Nothing to update ...');
          done();
        });
    });
  });
});