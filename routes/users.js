const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const users = require('../services/users');
const journal = require('../services/journal');
const {createToken, verifyToken} = require('../services/jwt')

router.use(cookieParser());

router.get("/:userId", verifyToken, async function(req,res,next){
    try {
        res.json(await users.getUserById(req.params.userId));
    } catch (err) {
        console.error(`Error while getting a user`, err.message);
        next(err);
    }
});

router.post("/", async function(req,res,next){
    try {
        const {username, password, first_name, last_name} = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        res.json(await users.createUser({username, password: hashedPassword, first_name, last_name}));
    } catch (err) {
        console.error(`Error while adding a user`, err.message);
        res.status(400).json({error: err.message});
        next(err);
    }
});

router.post("/login",  function(req,res, next){
    try {
        users.getUserByUsername(req.body.username)
        .then(user => {
            if(user.length > 0){
                bcrypt.compare(req.body.password,user[0].password)
                .then(result => {
                    if(result){
                        res.cookie("access-token",createToken(user[0]), { maxAge: 900000, httpOnly: true });
                        res.json({
                            user_id: user[0].user_id,
                            username: user[0].username,
                            first_name: user[0].first_name,
                            last_name: user[0].last_name    
                        })
                    }else{
                        throw new Error("Incorrect username/password!")
                    }
                })
                .catch(err => {
                    console.error("Error while loggin a user", err.message);
                    res.status(400).json({error: err.message});
                    next();
                })
            }else {
                throw new Error("Incorrect username/password!")
            }

        })         
        .catch(error => {
            console.error("Error while loggin a user", error.message);
            res.status(400).json({error: error.message});
            next();
        })   
    } catch (error) {
        console.error("Error while loggin a user", error.message);
        res.status(500).json({error: error.message});
        next();
    }
});

router.get("/:userId/journal", verifyToken, async function(req,res,next){
    try {
        res.status(200).json(await journal.getJournalByUserId(req.params.userId))
    } catch (error) {
        console.log("Error while getting journal", error.message);
        res.status(500).json({error: error.message});
        next();
    }
});

router.post("/:userId/journal", verifyToken, async function(req,res,next){
    try {
        res.status(200).json(await journal.createJournal(req.body,req.params.userId));
    } catch (error) {
        console.log("Error while creating a journal",error.message);
        res.status(500).json({error: error.message});
        next();
    }
})

router.put("/:userId/journal/:journalId", verifyToken, async function(req, res, next){
    try {
        res.status(200).json(await journal.updateJournal(req.body, req.params.userId, req.params.journalId));
    } catch (error) {
        console.log("Error while updating a journal",error.message);
        res.status(500).json({error: error.message});
        next(); 
    }
});

router.delete("/:userId/journal/:journalId", verifyToken, async function(req, res, next){
    try {
        res.status(200).json(await journal.deleteJournal(req.params.userId, req.params.journalId));
    } catch (error) {
        console.log("Error while deleting a journal",error.message);
        res.status(500).json({error: error.message});
        next();
    }
});

router.post("/logout", verifyToken, async function(req, res, next){
    try {
        res.clearCookie("access-token");
        res.status(204);
        res.end();
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})



module.exports = router;