const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require("../models/User");

const secret = 'g78h235u2h35ehhtuioerh89perh'

const tokenBlacklist = new Set();

async function register(username, email, password){
    const existing = await User.findOne({email}).collation({ locale: 'en', strength: 2})
    if (existing) {
        throw new Error('Email is taken');
    }

    existing = await User.findOne({username}).collation({ locale: 'en', strength: 2})
    if (username) {
        throw new Error('Username is taken');
    }

    const user = await User.create({
        username,
        email,
        hashedPassword: await bcrypt.hash(password, 10),
    })

    return createToken(user);

}

async function login(email, password){
    const user = await User.findOne({email}).collation({ locale: 'en', strength: 2})
    if (!user) {
        throw new Error('Incorrect email or password');
    }

    const match = await bcrypt.compare(password, user.hashedPassword);
    if (!match) {
        throw new Error('Incorrect email or password');
    }

    return createToken(user);
}

async function logout(token){
    tokenBlacklist.add(token);
}

function createToken(user){
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
    }

    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        accessToken: jwt.sign(payload, secret)
    }
}

function parseToken(token){
    if (tokenBlacklist.has(token)) {
        throw new Error('Token is blacklisted');
    }

    return jwt.verify(token, secret);
}

module.exports = {
    register,
    login,
    logout,
    parseToken
}