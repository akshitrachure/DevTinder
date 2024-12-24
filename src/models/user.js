const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 50,
    },
    lastName: {
        type: String,
        maxLength: 50,
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Your password is not strong " + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        max: 100
    },
    gender: {
        type: String,
        validate(value){
            if(!["Male", "Female", "Others"].includes(value)){
                throw new Error("Invalid Gender")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://th.bing.com/th/id/OIP.sP_Fy-jUeB7gAQ9ovXho_wHaF7?rs=1&pid=ImgDetMain",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL")
            }
        }
    },
    about: {
        type: String,
        default: "This is a default value for user description"
    },
    skills: {
        type: [String],
        validate(value){
            if(value.length > 5){
                throw new Error("Atmost 5 skills can be added.")
            }
        }
    }
}, {
    timestamps: true
});


userSchema.methods.getJWT = async function(){
    const user = this
    const token = await jwt.sign({ _id: user._id }, 'Akshit@DEVTinder23', {expiresIn: "7d"}); // expires in 7days
    return token;
}


userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this
    const passwordHash = user.password
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}

const User = mongoose.model("User", userSchema)

module.exports = User;