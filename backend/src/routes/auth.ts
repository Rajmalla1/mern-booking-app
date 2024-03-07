import express, {Request,Response} from "express";
import {check, validationResult} from 'express-validator';
import User from "../models/user";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';
import verifyToken from "../middleware/auth";

const router = express.Router();


router.post("/login", [ check("email", "Email is required").isEmail(),
 check("password", "Password with 6 or more character required").isLength({min: 6,
}),
], 
async (req: Request, res: Response)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ message: errors.array()})
    }

    const {email, password } = req.body; // destructoring email and password field from  the request body, as we want to fetch the user , as we wll be making database call to do this and we will put this logic into try catch.

    try{
        // short hand property saying go and find me the user that has an email address which we got from the reqest body
        const user = await User.findOne({email})

        if(!user){ // if we have try will esacpe this statement
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const token = jwt.sign({userID: user.id}, process.env.JWT_SECRET_KEY as string,
             {
                expiresIn: "1d",
            }
             );
        res.cookie("auth_token", token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });  
        res.status(200).json({userID: user._id})
    } catch (error){
        console.log(error); // this will log error back to our backend console if any occurs and a generic error back to our front end
        res.status(500).json({message:"something went wrong"});
    }
}

);

//whenever we make a request to validate token end point this will run some middleware which will check the http cookie that was send to us by the frontend in the request
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
    res.status(200).send({ userId: req.userId });
  });

  //after logout has been called the auth_token will expires and cannot be stroed or used again
router.post("/logout",(req: Request, res: Response) => {
    res.cookie("auth_token", "", {
        expires: new Date(0),
    });
    res.send();
});

export default router;