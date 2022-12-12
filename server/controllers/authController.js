const authController = require('express').Router();
const { body, validationResult } = require('express-validator');
const { getByUserId } = require('../services/projectService');

const { register, login, logout } = require('../services/userService');
const { parseError } = require('../util/parser');

authController.get('/', async (req, res) => {
    const user = req.user;
    if (user) {
        res.status(200).json(user)
    }
})

authController.post('/register',
    async (req, res) => {
        try {
            const token = await register(req.body.username, req.body.email, req.body.password);
            res.status(201).json(token);
        } catch (error) {
            console.log(error);
            res.status(400).json({error:error.message})
        }
        res.end();
    })

authController.post('/login', async (req, res) => {
    try {
        const token = await login(req.body.email, req.body.password);
        res.json(token);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
    res.end();
})

authController.get('/logout', async (req, res) => {
    const token = req.token;
    await logout(token);
    res.status(204).end();
})


authController.get('/getPersonal', async (req, res) => {
    const userId = req.user._id;
    const projects = await getByUserId(userId);
    res.status(200).json(projects);
    res.end();
})

module.exports = authController;