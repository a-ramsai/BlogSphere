const exp = require('express');
const UserAuthor = require('../models/userAuthorModel');
const userApp = exp.Router();
const expressAsyncHandler = require('express-async-handler');
const createUserOrAuthor = require('./createUserOrAuthor');
const Article = require('../models/articleModel');
const { requireAuth } = require('@clerk/express');

//get all users
userApp.get('/users',async(req,res)=>{
    //get user
    let userList = await UserAuthor.find();
    res.send({message:"users",payload:userList});
})
 
//create users
userApp.post('/user',expressAsyncHandler(createUserOrAuthor))

// Get all articles for users (only active articles)
userApp.get('/articles', requireAuth({ signInUrl: "unauthorized" }), expressAsyncHandler(async (req, res) => {
    const listOfArticles = await Article.find({ isArticleActive: true });
    res.status(200).send({ message: "articles", payload: listOfArticles });
}));

//add comments
userApp.put('/comment/:articleId',expressAsyncHandler( async (req,res)=>{
    const commentObj = req.body;
    const articleComment = await Article.findOneAndUpdate({articleId:req.params.articleId},
        {$push:{comments:commentObj}},
        {returnOriginal:false})
    
    res.status(200).send({message:"comment added",payload:articleComment}); 
}))

module.exports = userApp;