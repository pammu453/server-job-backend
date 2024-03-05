import User from '../models/user.model.js'
import { errorHandler } from '../utils/errorHandler.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req, res, next) => {
    try {
        const { name, email, password, role, phone } = req.body

        if (!name || !email || !password || !phone || !role) {
            return next(errorHandler(400, "Please provide all the details"))
        }

        const isEmail = await User.findOne({ email })
        if (isEmail) {
            return next(errorHandler(409, "Email already exists!"))
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await User({ name, email, password: hashedPassword, role, phone }).save()

        res.status(200).json({ message: "User registered succefully" })
    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body

        if (!email || !password || !role) {
            return next(errorHandler(400, "Please provide all the details"))
        }

        const user = await User.findOne({ email })
        if (!user) {
            return next(errorHandler(409, "Invalid credentials"))
        }

        const registeredPassword = await bcrypt.compare(password, user.password)
        if (!registeredPassword) {
            return next(errorHandler(409, "Invalid credentials"))
        }

        if (role !== user.role) {
            return next(errorHandler(409, "Invalid credentials"))
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2d" })

        const { password: pass, ...userData } = user._doc

        res.cookie('access_token', token, {
            httpOnly: true,
        });

        res.status(200).json({ user: userData, message: 'Login successful' });

    } catch (error) {
        next(error)
    }
}

export const logout = (req, res, next) => {
    try {
        res.clearCookie('access_token', {
            httpOnly: true,
        });
        res.status(200).json({ message: 'Logout successful!' });
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
}