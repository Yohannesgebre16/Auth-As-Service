import express from 'express'
import { isValidEmail , isStrongPassword } from './utils/validator.js'
const app = express()

app.use(express.json())

app.get('/health' , (req,res)=>{
    res.status(200).json({
        status: "healthy",
        service: "auth-as-a-service-initaltest  "
    })
})

// Temporary test case 

app.post('/api/v1/auth/test-validation', (req,res)=>{{
    const {email , password} = req.body;

    res.status(200).json({
        emailChecks: {input: email , valid: isValidEmail(email)},
        passwordChecks: {strong: isStrongPassword(password)}

    })
}})

export default app;