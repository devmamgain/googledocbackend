const notFound = (req, res, next) => {
    const error = new Error(
        `Route Not Found - ${req.originalUrl}`
    );

    res.status(404);

    next(error);
};

const errorHandler = (
    err,
    req,
    res,
    next
) => {
    let statusCode = res.statusCode === 200
        ? 500
        : res.statusCode;

    let message = err.message;

    if (err.code === 11000) {
        statusCode = 400;
        message = "Email already exists";
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = {
    notFound,
    errorHandler,
};