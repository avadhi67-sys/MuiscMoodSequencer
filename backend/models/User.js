const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter your name'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Please enter your email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please enter a valid email address'
            ]
        },
        password: {
            type: String,
            required: [true, 'Please enter your password'],
            minlength: 6
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        }
    },
    {
        timestamps: true
    }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password helper
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Return sanitized user object without password
userSchema.methods.toSafeObject = function () {
    return {
        id: this._id,
        _id: this._id,
        name: this.name,
        email: this.email,
        role: this.role,
        createdAt: this.createdAt
    };
};

module.exports = mongoose.model('User', userSchema);
