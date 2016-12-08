/**
 * Created by smitha on 10/24/16.
 */
module.exports = function (app, models) {

    var passport = require('passport').Passport;
    var passport_project = new passport();

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
    app.use(passport_project.initialize());
    app.use(passport_project.session());

    app.get('/api/shopper', findShopper);
    app.get('/api/shopper/:uid', findShopperById);
    app.post('/api/shopper', createShopper);
    app.put('/api/shopper/:uid', updateShopper);
    app.delete('/api/shopper/:uid', deleteShopper);
    app.get('/api/shopper/:uid/allShoppers', findAllShoppers);
    app.post('/api/shopper/login', passport_project.authenticate('local'), login);
    app.post('/api/shopper/checkLogin', checkLogin);
    app.post('/api/shopper/logout', logout);
    app.post('/api/shopper/checkAdmin', checkAdmin);
    app.post('/api/shopper/register', register);

    app.get('/shopper/auth/google', passport_project.authenticate('google', {scope: ['profile', 'email']}));
    app.get('/shopper/auth/google/callback',
        passport_project.authenticate('google', {
            successRedirect: '/project/#/shopper',
            failureRedirect: '/project/#/login'
        }));

    app.get('/shopper/auth/facebook', passport_project.authenticate('facebook', {scope: 'email'}));
    app.get('/shopper/auth/facebook/callback',
        passport_project.authenticate('facebook', {
            successRedirect: '/project/#/shopper',
            failureRedirect: '/project/#/login'
        }));


    var googleConfig = {
        clientID: process.env.GOOGLE_PROJECT_CLIENT_ID,
        clientSecret: process.env.GOOGLE_PROJECT_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_PROJECT_CALLBACK_URL
    };

    var facebookProjectConfig = {
        clientID: process.env.FACEBOOK_PROJECT_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_PROJECT_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_PROJECT_CALLBACK_URL
    };

    var shopperModel = models.shopperModel;

    passport_project.use(new LocalStrategy(localShopperStrategy));
    passport_project.use(new FacebookStrategy(facebookProjectConfig, facebookShopperStrategy));
    passport_project.use(new GoogleStrategy(googleConfig, googleShopperStrategy));
    passport_project.serializeUser(serializeUser);
    passport_project.deserializeUser(deserializeUser);


    //console.log(shopperModel);

    function localShopperStrategy(username, password, done) {
        shopperModel.findShopperByUsername(username)
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
        done(null, user);
    }

    function deserializeUser(user, done) {
        shopperModel
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

    function checkLogin(req, res) {
        var user = req.user;
        res.json(req.isAuthenticated() ? req.user : '0');
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
        var isAdmin = req.user.roles == 'ADMIN';
        if (loggedIn && isAdmin) {
            res.json(req.user);
        } else {
            res.send('0');
        }
    }

    function register(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        shopperModel
            .createShopper(user)
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

    function googleShopperStrategy(token, refreshToken, profile, done) {
        shopperModel
            .findShopperByGoogleId(profile.id)
            .then(
                function (user) {
                    if (user) {
                        return done(null, user);
                    } else {
                        var newGoogleUser = {
                            lastName: profile.name.familyName,
                            firstName: profile.name.givenName,
                            isShopper: true,
                            email: profile.emails[0].value,
                            google: {
                                id: profile.id,
                                token: token
                            }
                        };
                        return shopperModel.createShopper(newGoogleUser);
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

    function facebookShopperStrategy(token, refreshToken, profile, done) {
        shopperModel
            .findShopperByFacebookId(profile.id)
            .then(
                function (user) {
                    if (user) {
                        return done(null, user);
                    } else {
                        var names = profile.displayName.split(" ");
                        var newFacebookUser = {
                            lastName: names[1],
                            firstName: names[0],
                            isShopper: true,
                            email: profile.emails ? profile.emails[0].value : "",
                            facebook: {
                                id: profile.id,
                                token: token
                            }
                        };
                        shopperModel.createShopper(newFacebookUser)
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

    function createShopper(req, res) {
        var newUser = req.body; //to get the shopper object
        shopperModel.findShopperByUsername(newUser.username)
            .then(function (user) {
                if (user) {
                    res.status(400).send("Username already present");
                } else {
                    shopperModel.createShopper(newUser)
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

    function findShopper(req, res) {
        var params = req.params; //for path param
        var query = req.query; //for query param
        if (query.password && query.username) {
            findShopperByCredentials(req, res);
        } else if (query.username) {
            findShopperByUsername(req, res);
        } else {
            return res.json(req.user);
        }

    }

    function findShopperByUsername(req, res) {
        var username = req.query.username;
        shopperModel.findShopperByUsername(username)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.sendStatus(400);
                }
            );
    }

    function findShopperByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        shopperModel.findShopperByCredentials(username, password)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.sendStatus(400);
                }
            );
    }

    function findShopperById(req, res) {
        var userId = req.params.uid;
        shopperModel.findShopperById(userId)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.sendStatus(400);
                }
            );
    }

    function updateShopper(req, res) {
        var userUpdated = req.body;
        var userId = req.params['uid']; //can also use req.params.uid

        shopperModel.updateShopper(userId, userUpdated)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.statusCode(400).send("Unable to update user info");
                }
            );
    }

    function deleteShopper(req, res) {
        var userId = req.params['uid'];

        shopperModel.deleteShopper(userId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.statusCode(400).send("Unable to delete user");
                }
            )
    }

    function findAllShoppers(req, res) {
        var userId = req.params['uid'];

        shopperModel.findShopperById(userId)
            .then(
                function (user) {
                    if (user.toJSON().roles == 'ADMIN') {
                        shopperModel.findAllShoppers()
                            .then(
                                function (shoppers) {
                                    res.json(shoppers);
                                },
                                function (error) {
                                    res.sendStatus(400);
                                }
                            );
                    }
                },
                function (error) {
                    res.sendStatus(400);
                }
            );
    }
}