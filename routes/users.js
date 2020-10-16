var express = require("express");
var router = express.Router();
const bcryptjs = require("bcryptjs");
const passport = require("passport");

const User = require("../models/users");

const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

router.get("/", forwardAuthenticated, (req, res) => {
	res.send("<h1>User Home Page</h1>");
});

router.get("/login", forwardAuthenticated, (req, res) => {
	res.render("login");
});

router.get("/register", forwardAuthenticated, (req, res) => {
	res.render("register");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
	res.render("dashboard");
});

router.post("/register", async (req, res) => {
	const { name, email, password, password2, roll_no, course } = req.body;
	let errors = [];

	if (!name || !email || !password || !password2 || !roll_no || !course) {
		errors.push({ msg: "Please enter all fields" });
	}

	if (password != password2) {
		errors.push({ msg: "Passwords do not match" });
	}

	if (password.length < 6) {
		errors.push({ msg: "Password must be at least 6 characters" });
	}

	if (errors.length > 0) {
		res.render("register", {
			errors,
			name,
			email,
			password,
			password2,
			roll_no,
			course
		});
	} else {
		try {
			let user = await User.findOne({ email: email });
			if (user) {
				errors.push({ msg: "Email already exists" });
				res.render("register", {
					errors,
					name,
					email,
					password,
					password2
				});
			} else {
				const newUser = new User({
					name,
					email,
					password,
					roll_no,
					course
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
								res.redirect("/users/login");
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
	passport.authenticate("local", {
		successRedirect: "/users/dashboard",
		failureRedirect: "/users/login",
		failureFlash: true
	})(req, res, next);
});

router.get("/logout", (req, res) => {
	req.logout();
	//req.flash('success_msg', 'You are logged out');
	res.redirect("/users/login");
});

module.exports = router;
