//User Model
let User = require("../models/user.model");
let Event = require("../models/event.model");

//jwt for token
const jwt = require('jsonwebtoken');

//Mocha, Chai, chaiHttp Test
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

var token = "";

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

describe("/Login User", () => {
    it("it should Log a user", done => {
let user = {
    email: "userTest7@userTest.fr",
    password: "userTest"
};
        chai
            .request(server)
            .post("/users/login")
            .send(user)
            .end((err, res) => {
                if (err) done(err);
                res.should.have.status(200);
                res.body.should.be.a("object");
                token = res.body.token;
                res.body.should.property("token");
                done();
            });
    });
});


describe("//GET All Users", () => {
    it("it should show all User", done => {
        const email= "userTest7@userTest.fr";

        User.findOne({ email }, (err, user) => {
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                process.env.JWT_SECRET, { expiresIn: 360000 },
                (err, token) => {
                    chai
                        .request(server)
                        .get("/users/")
                        .set('x-auth-token',token)
                        .end((err, res) => {
                            if (err) done(err);
                            res.should.have.status(200);
                            res.body.should.be.a("array");
                            done();
                        });
                }
            )
        })

    });
});


describe("/GET/my-profile", () => {
    it("it should get a User given the x-auth-token", done => {
        const email= "userTest7@userTest.fr";

        User.findOne({ email }, (err, user) => {
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                process.env.JWT_SECRET, { expiresIn: 360000 },
                (err, token) => {
                    chai
                        .request(server)
                        .get("/users/my-profile")
                        .set('x-auth-token',token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a("object");
                            res.body.should.have.property("lastname").eql("USERTEST1");
                            done();
                        });
                }
            )
        })

    });
});

describe("/PUT/my-profile/", () => {
    it("it should update a user given by ID and X-auth-token", done => {
        const email = "userTest7@userTest.fr";

        let userUpdate = {
            firstname: "TestOK"
        }

        User.findOne({ email }, (err, user) => {
            const payload = {
                user: user.id
            }
            jwt.sign(
                payload,
                process.env.JWT_SECRET, { expiresIn: 360000 },
                (err, token) => {
                    chai
                        .request(server)
                        .put("/users/" + user.id)
                        .set('x-auth-token', token)
                        .send(userUpdate)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a("object");
                            res.body.should.have.property("firstname").eql("TestOK");
                            done();
                        });
                });
        });
    });
});

describe("/DELETE/:id User", () => {
    it("it should delete a User given the id", done => {
        const email = "userTest7@userTest.fr";

        User.findOne({ email }, (err, user) => {
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                process.env.JWT_SECRET, { expiresIn: 360000 },
                (err, token) => {
                    chai
                    .request(server)
                    .delete("/users/" + user.id)
                    .set('x-auth-token', token)
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
});

// EVENT SECTION 

describe("/Create Event", () => {
    it("it should not Register an event without tittle field", done => {
        let event = {
            date: 2025/05/05,
            hour: 22,
            minutes: 18,
            typeOfCuisine: "Americaine",
            typeOfMeal: "Diner",
            description: "lorem ipsum",
            menu: "lorem ipsum",
            allergens: "soja",
            zipCode: 91526,
            address: "9 rue de paris",
            city: "Paris",
            numberMaxOfGuests: 5,
            cost: 23
        };
        chai
            .request(server)
            .post("/events/create")
            .send(event)
            .set('x-auth-token', token )
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                res.body.should.have.property("msg");
                done();
            });
    });
    it("it should CREATE an event", done => {
        let event = {
            title: "burgers",
            date: 2023/05/05,
            hour: 22,
            minutes: 18,
            typeOfCuisine: "Americaine",
            typeOfMeal: "Diner",
            description: "lorem ipsum",
            menu: "lorem ipsum",
            allergens: "soja",
            zipCode: 91526,
            address: "9 rue de paris",
            city: "Paris",
            numberMaxOfGuests: 5,
            cost: 23
        };
        chai
            .request(server)
            .post("/events/create")
            .send(event)
            .set('x-auth-token', token )
            .end((err, res) => {
                if (err) done(err);
                res.should.have.status(200);
                done();
            });
    })
});

// Order section

describe("/create Order", () => {
    it("it should Not create Order with the NumberOfToques field empty", done => {
        let order = {
            userId = user.id,
            createdAt = Date.now
        };
        chai
            .request(server)
            .post("/order/create")
            .send(order)
            .set('x-auth-token', token )
            .end((err,res) => {
                if (err) done(err);
                res.should.have.status(400);
                done();
            });
    });
    it("it SHOULD create order", done => {
        let order = {
            userId = user.id,
            NumberOfToques = 20,
            createdAt = Date.now
        };
        chai
            .request(server)
            .post("/order/create")
            .send(order)
            .set('x-auth-token', token )
            .end((err,res) => {
                if (err) done(err);
                res.should.have.status(400);
                done();
            });
    });
});
describe("/show orders", () => {
    it("It should show all orders passed", done => {
        let order = {
            
        }
    })
})