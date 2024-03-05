const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong"

    if (err.name === 'ValidationError') {
        statusCode = 400
        const errors = Object.values(err.errors).map(error => error.message)
        message = errors.join('. ')
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
};

export default errorMiddleware
