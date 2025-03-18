const UserAuthor = require("../models/userAuthorModel");

async function createUserOrAuthor(req,res)
{
    const newUserAuthor = req.body;

    const UserinDb = await UserAuthor.findOne({email: newUserAuthor.email});
    //if user already existed display it
    if(UserinDb !== null)
    {
        //check with role
        if(newUserAuthor.role === UserinDb.role)
        {
            if (UserinDb.isBlocked) {
                return res.status(403).send({
                    message: "Account blocked",
                    error: "Your account is blocked. Please contact admin"
                });
            }
            res.status(200).send({message: newUserAuthor.role, payload: UserinDb})
        }
        else
        {
            res.status(200).send({message: "invalid role"})
        }
    }
    else {
        //create a new user 
        const userAuthorDoc = new UserAuthor(newUserAuthor);
        await userAuthorDoc.save();
        res.status(201).send({message: "new user/Author created", payload: userAuthorDoc})
    }
}

module.exports = createUserOrAuthor;