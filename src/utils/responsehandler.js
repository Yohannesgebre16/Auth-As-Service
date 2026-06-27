export const sendSuccess = (res, message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
        status: "success",
        timestamp: new Date().toISOString(),
        message,
        data
    });
};

export const sendError = (res, message, statusCode = 400, details = null) => {
    return res.status(statusCode).json({
        status: "error",
        timestamp: new Date().toISOString(),
        error: {
            message,
            statusCode,
            ...(details && { details })
        }
    });
};