const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    const { method, url } = req;

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;

        // Establish terminal color codes based on HTTP Status Code
        let statusColor = "\x1b[32m"; // Default to Green (Success)
        if (statusCode >= 400 && statusCode < 500) {
            statusColor = "\x1b[33m"; // Yellow for Client Errors (Bad Request/Unauthorized)
        } else if (statusCode >= 500) {
            statusColor = "\x1b[31m"; // Red for Server Faults
        }

        const resetColor = "\x1b[0m"; // Reset terminal to default text styling

        console.log(
            `[${timestamp}] ${method} ${url} | Status: ${statusColor}${statusCode}${resetColor} | Duration: ${duration}ms`
        );
    });

    next();
};

export default requestLogger;