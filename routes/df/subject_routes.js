const express = require("express");
const router = express.Router();
const databaseSchema = require("../../schemas/df/subject_schema");

router.post("/retrieve", (req, res) => {
    databaseSchema.find()
        .skip(req.body.skip)
        .limit(req.body.limit)
        .then(results => {
            res.json(results);
        })
});

router.post("/retrieve/:id", (req, res) => {
    let id = req.params.id;
    databaseSchema.find({id: id})
        .exec()
        .then(resultList => {
            if (resultList.length < 1) {
                return res.status(401).json({
                    message: "Authorization Failed!"
                });
            }
            if (resultList) {
                res.json(resultList[0]);
            }
        })
});

router.post("/add", (req, res) => {
    let databaseModel = new databaseSchema(req.body);
    databaseModel
        .save()
        .then(result => {
            res.status(200).json({
                message: "Added successfully",
                createdParent: result
            });
        })
        .catch(err => {
            res.status(400).json({
                message: "Adding new failed",
                error: err
            });
        });
});

router.post("/update/:id", (req, res) => {
    databaseSchema.update({id: req.params.id}, req.body)
        .then(result => {
            res.status(200).json({
                message: "Updated successfully",
                created: result
            });
        })
        .catch(err => {
            res.status(400).json({
                message: "Updating failed",
                error: err
            });
        });
});

router.post("/delete/:id", (req, res) => {
    databaseSchema.findOneAndDelete(
        {id: req.params.id},
        (err, result) => {
            if (err) {
                res.json(err);
            } else {
                res.json("Deleted successfully");
            }
        }
    );
});

module.exports = router;