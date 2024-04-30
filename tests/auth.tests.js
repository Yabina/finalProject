//require('mocha');
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const app = require("../app"); // assuming your app file is in the root directory

chai.use(chaiHttp);

describe("Authentication API", () => {
  describe("POST /register", () => {
    it("should register a new user", (done) => {
      chai
        .request(app)
        .post("/register")
        .send({ username: "testuser", email: "test@example.com", password: "testpassword" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("msg").equal("New user created!");
          done();
        });
    });
  });

  describe("POST /login", () => {
    it("should login with valid credentials", (done) => {
      chai
        .request(app)
        .post("/login")
        .send({ username: "testuser", password: "testpassword" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("auth").equal(true);
          expect(res.body).to.have.property("msg").equal("Logged in!");
          expect(res.body).to.have.property("access_token");
          expect(res.body).to.have.property("expires_in");
          expect(res.body).to.have.property("refresh_token");
          done();
        });
    });

    it("should fail to login with invalid credentials", (done) => {
      chai
        .request(app)
        .post("/login")
        .send({ username: "invaliduser", password: "invalidpassword" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("msg").equal("Invalid password");
          done();
        });
    });
  });

  describe("POST /token", () => {
    // Test cases for token generation can be added here
  });

  describe("POST /logout", () => {
    it("should logout the user", (done) => {
      chai
        .request(app)
        .post("/logout")
        .send({ token: "valid_refresh_token" }) // Assuming you have a valid refresh token
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.equal("Logout successful");
          done();
        });
    });
  });
});