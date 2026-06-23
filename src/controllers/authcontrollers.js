import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { isValidEmail, isStrongPassword, validateRegistrationPayload } from '../utils/validator.js'

const globalUsersDatabase = [];

const generateServiceToken = (username, role, appId) => {
    return jwt.sign(
        { username, role, originApp: appId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

export const registerUser = async (req, res) => {
    try {
        const { appId, role } = req.body;

        const validation = validateRegistrationPayload(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ 
                status: "error", 
                message: `Missing required fields: ${validation.missingFields.join(', ')}` 
            });
        }

        const { username, email, password } = req.body;

        if (!appId || !role) {
            return res.status(400).json({ status: "error", message: "Missing service configurations: appId or role" });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ status: "error", message: "Invalid email format structure" });
        }

        if (!isStrongPassword(password)) {
            return res.status(400).json({ status: "error", message: "Password must be at least 8 characters long and contain both letters and numbers" });
        }

        const userExists = globalUsersDatabase.find(user => 
            (user.username === username || user.email === email) && user.appId === appId
        );
        if (userExists) {
            return res.status(400).json({ status: "error", message: "Username or Email already registered under this application" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = {
            username,
            email,
            password: hashedPassword,
            role,
            appId
        };
        globalUsersDatabase.push(newUser);

        const token = generateServiceToken(newUser.username, newUser.role, newUser.appId);

        res.status(201).json({
            status: "success",
            message: "Registration successful. Payload verified.",
            token
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal verification fault during validation middleware checks." });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password, appId } = req.body;

        if (!username || !password || !appId) {
            return res.status(400).json({ status: "error", message: "Missing required fields: username, password, or appId" });
        }

        const userFound = globalUsersDatabase.find(user => user.username === username && user.appId === appId);
        if (!userFound) {
            return res.status(401).json({ status: "error", message: "Invalid credentials or application origin" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userFound.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        const token = generateServiceToken(userFound.username, userFound.role, userFound.appId);

        res.status(200).json({
            status: "success",
            message: "Login successful. Authentication token issued.",
            token
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal verification fault during login identity checks." });
    }
};