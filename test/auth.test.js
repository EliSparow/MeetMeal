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
            age: 18,
            password: "userTest"
        };
        chai
            .request(server)
            .post("/users/register")
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                res.body.should.have.property("msg").eql("Tous les champs sont obligatoires.");
                // res.body.errors.should.have.property("email");
                // res.body.errors.email.should.have.property("kind").eql("required");
                done();
        });
    });
//     it("it should POST a user", done => {
//         let user = {
//             firstname: "userTest1",
//             lastname: "USERTEST1",
//             age: 30,
//             email: "userTest11@userTest.fr",
//             password: "userTest"
//         };
//         chai
//             .request(server)
//             .post("/users/register")
//             .send(user)
//             .end((err, res) => {
//                 if (err) done(err);
//                 console.log(res.body);
//                 res.should.have.status(200);
//                 // res.body.should.be.a("object");
//                 // console.log(res.body);
//                 done();
//             });
//     })
});

describe("/POST User", () => {
    it("it should Log a user", done => {
        let user = {
            email: "maxim3andr3@gmail.com",
            password: "monpassword"
        };
        chai
            .request(server)
            .post("/users/login")
            .send(user)
            .end((err, res) => {
                if (err) done(err);
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.property("token");
                done();
            })
    })
})
