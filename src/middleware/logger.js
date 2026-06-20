//Global reuests loggin middleware

const requestLogger = (req,res , next)=>{
    const timestamp = new Date().toISOString() ;
    const {method , url} = req;

    console.log(`[${timestamp}] Incomings requests: ${method} to ${url}`)

    next()
}

export default requestLogger;