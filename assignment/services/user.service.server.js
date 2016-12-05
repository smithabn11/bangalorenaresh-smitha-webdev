/**
 * Created by smitha on 10/24/16.
 */
module.exports = function (app, models) {

    var passport = require('passport').Passport;
    var passport_assignment = new passport();


    var LocalStrategy = require('passport-local').Strategy;
    var cookieParser = require('cookie-parser');
    var session = require('express-session');
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;

    var bcrypt = require("bcrypt-nodejs");

    app.use(session({
        secret: process.env.SESSION_CLIENT_SECRET,
        resave: true,
        saveUninitialized: true
    }));

    app.use(cookieParser());
    app.use(passport_assignment.initialize());
    app.use(passport_assignment.session());

    app.get('/api/user', findUser);
    app.get('/api/user/:uid', findUserById);
    app.post('/api/user', createUser);
    app.put('/api/user/:uid', loggedInAndSelf, updateUser);
    app.delete('/api/user/:uid', loggedInAndSelf, deleteUser);
    app.post('/api/login', passport_assignment.authenticate('local'), login);
    app.post('/api/checkLogin', checkLogin);
    app.post('/api/logout', logout);
    app.post('/api/checkAdmin', checkAdmin);
    app.post('/api/register', register);

    app.get('/auth/assignment/google', passport_assignment.authenticate('google', {scope: ['profile', 'email']}));
    app.get('/auth/google/callback',
        passport_assignment.authenticate('google', {
            successRedirect: '/assignment/#/user',
            failureRedirect: '/assignment/#/login'
        }));

    app.get('/auth/assignment/facebook', passport_assignment.authenticate('facebook', {scope: 'email'}));
    app.get('/auth/facebook/callback',
        passport_assignment.authenticate('facebook', {
            successRedirect: '/assignment/#/user',
            failureRedirect: '/assignment/#/login'
        }));

    var googleConfig = {
        clientID: process.env.GOOGLE_ASSIGNMENT_CLIENT_ID,
        clientSecret: process.env.GOOGLE_ASSIGNMENT_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_ASSIGNMENT_CALLBACK_URL
    };

    var facebookAssignmentConfig = {
        clientID: process.env.FACEBOOK_ASSIGNMENT_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_ASSIGNMENT_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_ASSIGNMENT_CALLBACK_URL
    };

    var userModel = models.userModel;

    passport_assignment.use(new LocalStrategy(localStrategy));
    passport_assignment.use(new FacebookStrategy(facebookAssignmentConfig, facebookStrategy));
    passport_assignment.use(new GoogleStrategy(googleConfig, googleStrategy));
    passport_assignment.serializeUser(serializeUser);
    passport_assignment.deserializeUser(deserializeUser);


    function localStrategy(username, password, done) {
        userModel.findUserByUsername(username)
            .then(
                function (user) {
                    // if the user exists, compare passwords with bcrypt.compareSync
                    if (user != null && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logout();
        res.sendStatus(200);
    }

    function serializeUser(user, done) {
        if (user.isShopper == undefined) {
            done(null, user);
        }
    }

    function deserializeUser(user, done) {
        if (user.isShopper == undefined) {
            userModel
                .findUserById(user._id)
                .then(
                    function (user) {
                        done(null, user);

                    },
                    function (err) {
                        done(err, null);
                    }
                );
        }

        if (user.isShopper) {
            models.shopperModel
                .findShopperById(user._id)
                .then(
                    function (user) {
                        done(null, user);
                    },
                    function (err) {
                        done(err, null);
                    }
                );
        }


    }

    function checkLogin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function loggedInAndSelf(req, res, next) {
        var loggedIn = req.isAuthenticated();
        var userId = req.params.uid;
        var self = userId == req.user._id;
        if (self && loggedIn) {
            next();
        } else {
            res.sendStatus(400).send("You are not the same person");
        }

    }

    function checkAdmin(req, res) {
        var loggedIn = req.isAuthenticated();
        var isAdmin = req.user.role == 'ADMIN';
        if (loggedIn && isAdmin) {
            res.json(req.user);
        } else {
            res.send('0');
        }
    }

    function register(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        userModel
            .createUser(user)
            .then(
                function (user) {
                    if (user) {
                        req.login(user, function (err) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                }
            );
    }

    function googleStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByGoogleId(profile.id)
            .then(
                function (user) {
                    if (user) {
                        return done(null, user);
                    } else {
                        var newGoogleUser = {
                            lastName: profile.name.familyName,
                            firstName: profile.name.givenName,
                            email: profile.emails[0].value,
                            google: {
                                id: profile.id,
                                token: token
                            }
                        };
                        return userModel.createUser(newGoogleUser);
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            )
            .then(
                function (user) {
                    return done(null, user);
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByFacebookId(profile.id)
            .then(
                function (user) {
                    if (user) {
                        return done(null, user);
                    } else {
                        var names = profile.displayName.split(" ");
                        var newFacebookUser = {
                            lastName: names[1],
                            firstName: names[0],
                            email: profile.emails ? profile.emails[0].value : "",
                            facebook: {
                                id: profile.id,
                                token: token
                            }
                        };
                        userModel.createUser(newFacebookUser)
                            .then(
                                function (user) {
                                    return done(null, user);
                                },
                                function (err) {
                                    if (err) {
                                        return done(err);
                                    }
                                }
                            );
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            )

    }


    function createUser(req, res) {
        var newUser = req.body; //to get the user object

        userModel.findUserByUsername(newUser.username)
            .then(function (user) {
                if (user) {
                    res.status(400).send("Username already present");
                } else {
                    userModel.createUser(newUser)
                        .then(function (user) {
                                res.json(user);
                            },
                            function (error) {
                                res.statusCode(400).send("Unable to create user");
                            }
                        );
                }
            });
    }

    function findUser(req, res) {
        var params = req.params; //for path param
        var query = req.query; //for query param
        if (query.password && query.username) {
            findUserByCredentials(req, res);
        } else if (query.username) {
            findUserByUsername(req, res);
        } else {
            return res.json(req.user);
        }

    }

    function findUserByUsername(req, res) {
        var username = req.query.username;

        userModel.findUserByUsername(username)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.sendStatus(400);
                }
            );
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;

        userModel.findUserByCredentials(username, password)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.sendStatus(400);
                }
            );
    }

    function findUserById(req, res) {
        var userId = req.params.uid;

        userModel.findUserById(userId)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.sendStatus(400);
                }
            );
    }

    function updateUser(req, res) {
        var userUpdated = req.body;
        var userId = req.params['uid']; //can also use req.params.uid

        userModel.updateUser(userId, userUpdated)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.statusCode(400).send("Unable to update user info");
                }
            );
    }

    function deleteUser(req, res) {
        var userId = req.params['uid'];

        userModel.deleteUser(userId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.statusCode(400).send("Unable to delete user");
                }
            )
    }
}