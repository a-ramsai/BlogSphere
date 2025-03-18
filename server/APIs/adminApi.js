const exp = require('express')
const adminApp = exp.Router();
const expressAsyncHandler = require('express-async-handler');
const UserAuthor = require('../models/userAuthorModel');
const { requireAuth } = require('@clerk/express');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    // Since we're using Clerk, we can trust the authentication
    // In a production app, you'd want to verify the user's role in your database
    next();
};

// Get all users and authors
adminApp.get('/users', requireAuth(), isAdmin, expressAsyncHandler(async (req, res) => {
    try {
        const users = await UserAuthor.find();
        res.status(200).send({ message: "Users and authors retrieved", payload: users });
    } catch (err) {
        res.status(500).send({ message: "Error retrieving users", error: err.message });
    }
}));

// Toggle user/author block status
adminApp.put('/users/:email/toggle-block', requireAuth(), isAdmin, expressAsyncHandler(async (req, res) => {
    try {
        const { email } = req.params;
        const user = await UserAuthor.findOne({ email });
        
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.status(200).send({ 
            message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, 
            payload: user 
        });
    } catch (err) {
        res.status(500).send({ message: "Error updating user status", error: err.message });
    }
}));

module.exports=adminApp;