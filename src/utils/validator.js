//Input validation test 

export const isValidEmail = (email)=>{
    if(!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)
}


export const isStrongPassword = (password)=>{
    if(!password) return false;

    if(password.length < 8) return false;

    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)

    return hasLetter && hasNumber;
}


export const validateRegistrationPayload = (body)=>{
    const requireFields = ['username' , 'email' , 'password']
    const missingFields = []

    requireFields.forEach(field =>{
        if(!body || body[field] === undefined || body[field] === ''){
            missingFields.push(field)
        }
    })

    return {
        isValid: missingFields.length === 0,
        missingFields    
    }
}