import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const globalUsersDatabase = [];
const ALLOWED_ROLES = ['Admin', 'User', 'Guest'];

const generateServiceToken = (name, role, appId) => {
    return jwt.sign(
        { name, role, originApp: appId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

export const registerUser = async (req, res) => {
    try {
        const { name, password, role, appId } = req.body;

        if (!name || !password || !role || !appId) {
            return res.status(400).json({ status: "error", message: "Missing required fields: name, password, role, or appId" });
        }

        if (!ALLOWED_ROLES.includes(role)) {
            return res.status(400).json({ status: "error", message: "Invalid role assigned for this service" });
        }

        const userExists = globalUsersDatabase.find(user => user.name === name && user.appId === appId);
        if (userExists) {
            return res.status(400).json({ status: "error", message: "User already registered under this application" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = {
            name,
            password: hashedPassword,
            role,
            appId
        };
        globalUsersDatabase.push(newUser);

        const token = generateServiceToken(newUser.name, newUser.role, newUser.appId);

        res.status(201).json({
            status: "success",
            message: "Registration successful. User created and authenticated.",
            token
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal verification fault during registration." });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { name, password, appId } = req.body;

        if (!name || !password || !appId) {
            return res.status(400).json({ status: "error", message: "Missing required fields: name, password, or appId" });
        }

        const userFound = globalUsersDatabase.find(user => user.name === name && user.appId === appId);
        if (!userFound) {
            return res.status(401).json({ status: "error", message: "Invalid credentials or application origin" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userFound.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        const token = generateServiceToken(userFound.name, userFound.role, userFound.appId);

        res.status(200).json({
            status: "success",
            message: "Login successful. Authentication token issued.",
            token
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal verification fault during login." });
    }
};