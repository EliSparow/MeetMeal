//User Model
let User = require("../models/user.model");

//Mocha, Chai, chaiHttp Test
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();


chai.use(chaiHttp);

describe("/Register User", () => {
    it("it should not Register a User without email field", done => {
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
                done();
            });
    });
        it("it should REGISTER a user", done => {
            let user = {
    firstname: "userTest1",
    lastname: "USERTEST1",
    age: 30,
    email: "userTest7@userTest.fr",
    password: "userTest"
            };
            chai
                .request(server)
                .post("/users/register")
                .send(user)
                .end((err, res) => {
                    if (err) done(err);
                    res.should.have.status(200);
                    done();
                });
        })
});

// describe("/Login User", () => {
//     it("it should Log a user", done => {
// let user = {
//     email: "maxim3andr3@gmail.com",
//     password: "monpassword"
// };
//         chai
//             .request(server)
//             .post("/users/login")
//             .send(user)
//             .end((err, res) => {
//                 if (err) done(err);
//                 res.should.have.status(200);
//                 res.body.should.be.a("object");
//                 res.body.should.property("token");
//                 done();
//             });
//     });
// });

describe("/GET All Users", () => {
    it("it should show all User", done => {
        chai
            .request(server)
            .get("/users/")
            .set('x-auth-token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWQ4NGE0MjM1MDhkNjMwMDE3OTgxOGE0In0sImlhdCI6MTU2OTA2MDkzMSwiZXhwIjoxNTY5NDIwOTMxfQ.r7mL85S2HE07v6bGuFfxTd-HWpz6bVNhsMAPIQ8-rYk")
            .end((err, res) => {
                if (err) done(err);
                res.should.have.status(200);
                res.body.should.be.a("array");
                done();
            });
    });
});

describe("/DELETE/:id User", () => {
    it("it should delete a User given the id", done => {
        let user = new User({
            firstname: "userTest1",
            lastname: "USERTEST1",
            age: 30,
            email: "userTest8@userTest.fr",
            password: "userTest"
        });
        console.log(user);
        
        user.save((err, user) => {
            chai
                .request(server)
                .delete("/users/" + user.id)
                .set('x-auth-token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWQ4NGE0MjM1MDhkNjMwMDE3OTgxOGE0In0sImlhdCI6MTU2OTA2MDkzMSwiZXhwIjoxNTY5NDIwOTMxfQ.r7mL85S2HE07v6bGuFfxTd-HWpz6bVNhsMAPIQ8-rYk")
                .end((err, res) => {
                    if (err) done(err);
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("msg").eql("Utilisateur Supprime");
                    done();
                });
            });
    });
});