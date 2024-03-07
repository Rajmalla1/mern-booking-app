import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type UserType = {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

const userSchema = new mongoose.Schema({
    email:{type: String, required: true, unique:true },
    password:{ type: String, required: true},
    firstName:{ type: String, required: true},
    lastName:{ type: String, required: true},
}); 

// telling mongoose that before any updates get saved check if the password is changed, if it has changed then bcrypt to hash it and then we just call next function.

userSchema.pre("save", async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
   } 
    next();
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;