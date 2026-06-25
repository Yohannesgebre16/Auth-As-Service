const requestTracker = new Map();

export const rateLimiter = (maxRequests, windowMs) => {
    return (req, res, next) => {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const now = Date.now();

        if (!requestTracker.has(ip)) {
            requestTracker.set(ip, []);
        }

        const timestamps = requestTracker.get(ip);
        
        while (timestamps.length > 0 && timestamps[0] <= now - windowMs) {
            timestamps.shift();
        }

        if (timestamps.length >= maxRequests) {
            const oldestTimestamp = timestamps[0];
            const retryAfterMs = oldestTimestamp + windowMs - now;
            const retryAfterSec = Math.ceil(retryAfterMs / 1000);

            return res.status(429).json({
                status: "error",
                message: `Too many authentication requests. Please try again in ${retryAfterSec} seconds.`
            });
        }

        timestamps.push(now);
        next();
    };
};