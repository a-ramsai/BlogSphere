const exp = require('express');
const createUserOrAuthor = require('./createUserOrAuthor');
const authorApp = exp.Router();
const expressAsyncHandler = require('express-async-handler');
const Article = require('../models/articleModel');
const { requireAuth } = require('@clerk/express');
require('dotenv').config();

// Create author
authorApp.post('/author', expressAsyncHandler(createUserOrAuthor));

// Create article
authorApp.post('/article', expressAsyncHandler(async (req, res) => {
    const articleBody = req.body;
    const newArticle = new Article(articleBody);
    const articleObj = await newArticle.save();
    res.status(201).send({ message: "article published", payload: articleObj });
}));

// Get all articles (only active articles)
authorApp.get('/articles', requireAuth({ signInUrl: "unauthorized" }), expressAsyncHandler(async (req, res) => {
    const listOfArticles = await Article.find({ isArticleActive: true });
    res.status(200).send({ message: "articles", payload: listOfArticles });
}));

authorApp.get('/unauthorized', (req, res) => {
    res.send({ message: "Unauthorized request" });
});

// Update article using articleId from route parameter
authorApp.put('/article/:articleId', expressAsyncHandler(async (req, res) => {
    const modifiedArticle = req.body;
    const articleId = req.params.articleId;
    const dbRes = await Article.findOneAndUpdate(
        { articleId: articleId },
        { ...modifiedArticle },
        { new: true }
    );
    res.status(200).send({ message: "article modified", payload: dbRes });
}));

// Soft delete article using articleId from route parameter
authorApp.put('/articles/:articleId', expressAsyncHandler(async (req, res) => {
    const modifiedArticle = req.body;
    const articleId = req.params.articleId;
    const dbRes = await Article.findByIdAndUpdate(
        articleId,
        { ...modifiedArticle },
        { new: true }
    );
    res.status(200).send({ message: "article deleted or restored", payload: dbRes });
}));

module.exports = authorApp;
