var express = require("express");
var router = express.Router();
const bcryptjs = require("bcryptjs");
const passport = require("passport");

const User = require("../models/users");

const { ensureAuthenticated, forwardAuthenticated } = require("../config/admin_auth");

router.get("/", forwardAuthenticated, (req, res) => {
    res.send("<h1>Admin Home Page</h1>");
});

router.get("/login", forwardAuthenticated, (req, res) => {
    res.render("admin_login");
});

router.get("/register", ensureAuthenticated, (req, res) => {
    res.render("admin_register");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
    res.render("admin_dashboard");
});

router.post("/register", async (req, res) => {
    const { name, email, password, password2, emp_code } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2 || !emp_code) {
        errors.push({ msg: "Please enter all fields" });
    }

    if (password != password2) {
        errors.push({ msg: "Passwords do not match" });
    }

    if (password.length < 6) {
        errors.push({ msg: "Password must be at least 6 characters" });
    }

    if (errors.length > 0) {
        res.render("admin_register", {
            errors,
            name,
            email,
            password,
            password2,
            emp_code
        });
    } else {
        try {
            let user = await User.findOne({ email: email });
            if (user) {
                errors.push({ msg: "Email already exists" });
                res.render("admin_register", {
                    errors,
                    name,
                    email,
                    password,
                    password2,
                    emp_code
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password,
                    emp_code,
                    is_examiner: true
                });
                try {
                    bcryptjs.genSalt(10, async (error, salt) => {
                        if (error) {
                            throw error;
                        }
                        try {
                            const hashedPassword = await bcryptjs.hash(
                                newUser.password,
                                salt
                            );
                            newUser.password = hashedPassword;
                            try {
                                const user = await newUser.save();
                                req.flash(
                                    "success_msg",
                                    "You are now registered and can log in"
                                );
                                res.redirect("/admin/login");
                            } catch (e) {
                                console.log(e);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
});

// Login
router.post("/login", (req, res, next) => {
    User.findOne({email: req.body.email}, (err, user)=>{
        if (user == null || user.is_examiner == false) {
            console.log(565555);
            req.flash(
                "error_msg",
                "Invalid Admin!"
            );
            res.redirect("/admin/login");
        }
        else if(user.is_examiner == true) {
            passport.authenticate("local", {
                successRedirect: "/admin/dashboard",
                failureRedirect: "/admin/login",
                failureFlash: true
            })(req, res, next);
        } else {
            if(err) 
                throw err;
            else {
                res.redirect("/admin/login");
            }
        }
    })
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect("/admin/login");
});

module.exports = router;
