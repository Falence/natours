const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email!']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password!'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password!'],
        validate: {
            // this works only on CREATE and SAVE !!!
            validator: function(el) {
                return el === this.password
            },
            message: 'Passwords are not the same!'
        }
    }
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next() // hash only when the password field is modified

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined    // delete the 'passwordConfirm' field. we needed the field initially just for verification
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User