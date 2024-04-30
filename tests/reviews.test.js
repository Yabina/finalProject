//require('mocha');
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const app = require("../app"); // assuming your app file is in the root directory

chai.use(chaiHttp);

describe("Reviews API", () => {
  describe("GET /reviews", () => {
    it("should return all reviews for the user", (done) => {
      chai
        .request(app)
        .get("/reviews")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });
  });

  describe("GET /reviews/:reviewId", () => {
    it("should return a single review for the user", (done) => {
      chai
        .request(app)
        .get("/reviews/1")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          done();
        });
    });
  });

  describe("POST /reviews", () => {
    it("should create a new review", (done) => {
      chai
        .request(app)
        .post("/reviews")
        .send({ user: { id: 1 }, book_title: "Test Book" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("msg").equal("Added review successfully!");
          done();
        });
    });
  });

  describe("PUT /reviews/:reviewId", () => {
    it("should update a review", (done) => {
      chai
        .request(app)
        .put("/reviews/1")
        .send({ book_title: "Updated Book" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("affectedRows").equal(1);
          done();
        });
    });
  });

  describe("DELETE /reviews/:reviewId", () => {
    it("should delete a review", (done) => {
      chai
        .request(app)
        .delete("/reviews/1")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message").equal("Deleted successfully!");
          done();
        });
    });
  });
});