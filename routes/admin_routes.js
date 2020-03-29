const express = require("express");
const adminSchema = require("../schemas/admin_schema");
const authSchema = require("../schemas/auth_schema");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const configs = require("../config/config.json");
const utils = require("../utils/extract_token");
const constants = require("../utils/constants");

const router = express.Router();

//Retrieve all admins
router.get("/", utils.extractToken, (req, res) => {
    jwt.verify(req.token, configs.JWT_KEY_ADMIN, (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            adminSchema.find((err, admin) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json({
                        message: admin,
                        authData
                    });
                }
            });
        }
    });
});

//Retrieve admin  by ID
router.get("/:id", utils.extractToken, (req, res) => {
    jwt.verify(req.token, configs.JWT_KEY_ADMIN, (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            let id = req.params.id;
            adminSchema.findById(id, (err, admin) => {
                res.json(admin);
            });
        }
    });
});

//Add new admin
router.post("/add", utils.extractToken, (req, res) => {
    jwt.verify(req.token, configs.JWT_KEY_ADMIN, (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            adminSchema.find({
                adminID: req.body.adminID
            })
                .exec()
                .then(admin => {
                    if (admin.length >= 1) {
                        res.status(409).json({
                            message: "admin already exists"
                        });
                    } else {
                        const  hash = bcrypt.hashSync(req.body.password, 8);
                        const adminModel = new adminSchema({
                            _id: mongoose.Types.ObjectId(),
                            adminID: req.body.adminID,
                            name: req.body.name,
                            email: req.body.email
                        });
                        const authModel = new authSchema({
                            _id: mongoose.Types.ObjectId(),
                            userID: req.body.userID,
                            userType: constants.USER_TYPE_ADMIN,
                            passwordHash: hash
                        });
                        authModel.save().catch(err => {
                            console.log(err.message);
                            res.status(500).json({
                                error: err
                            });
                        });
                        adminModel
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "admin added",
                                    createdAdmin: result
                                });
                            })
                            .catch(err => {
                                console.log(err.message);
                                res.status(500).json({
                                    error: err
                                });
                            });

                    }
                });
        }
    });
});

//Add new admin
router.post("/addNoLogin", (req, res) => {
            adminSchema.find({
                adminID: req.body.adminID
            })
                .exec()
                .then(admin => {
                    if (admin.length >= 1) {
                        res.status(409).json({
                            message: "admin already exists"
                        });
                    } else {
                        const  hash = bcrypt.hashSync(req.body.password, 8);
                        const adminmodel = new adminSchema({
                            _id: mongoose.Types.ObjectId(),
                            adminID: req.body.adminID,
                            name: req.body.name,
                            email: req.body.email
                        });
                        const authModel = new authSchema({
                            _id: mongoose.Types.ObjectId(),
                            userID: req.body.adminID,
                            userType: constants.USER_TYPE_ADMIN,
                            passwordHash: hash,
                        });
                        authModel.save().catch(err => {
                            console.log(err.message);
                            res.status(500).json({
                                error: err
                            });
                        });
                        adminmodel
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "admin added",
                                    createdAdmin: result
                                });
                            })
                            .catch(err => {
                                console.log(err.message);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
});

//update
router.post("/update/:id", utils.extractToken, (req, res) => {
    jwt.verify(req.token, configs.JWT_KEY_ADMIN, (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            adminSchema.findById(req.params.id, (err, admin) => {
                if (!admin) {
                    res.status(404).send("data is not found");
                } else {
                    (admin.adminID = req.body.adminID), (admin.name = req.body.name);
                    admin.mail = req.body.email;
                    admin.password = req.body.password;

                    admin
                        .save()
                        .then(admin => {
                            res.json("admin updated");
                        })
                        .catch(err => {
                            res.status(400).send("Update not successful");
                        });
                }
            });
        }
    });
});

router.delete("/delete/:id", utils.extractToken, (req, res) => {
    jwt.verify(req.token, configs.JWT_KEY_ADMIN, (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            adminSchema.findOneAndDelete({_id: req.params.id}, (err, admin) => {
                if (err) {
                    res.json(err);
                } else {
                    res.json("deleted successfully");
                }
            });
        }
    });
});

module.exports = router;
