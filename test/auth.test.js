let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

chai.use(chaiHttp);

describe("/POST User", () => {
    it("it should not POST a User without email field", done => {
        let user = {
            firstname: "userTest",
            lastname: "USERTEST",
            dateOfBirth: "2002-12-09",
            password: "userTest"
        };
        chai
            .request(server)
            .post("/users/register")
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                res.body.should.have.property("errors");
                res.body.errors.should.have.property("email");
                res.body.errors.email.should.have.property("kind").eql("required");
                done();
        });
    });
})