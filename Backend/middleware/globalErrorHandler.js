const globalErrorHandler = (err, req, res, next) => {
    console.log(res.statusCode);
    const errorResponse = {
        statusCode: err.statusCode || 500,
        status:"failed",
        message:err.message || "An unknown error occurred",
        stack:err.stack
    }

    return res.json(errorResponse);
};

export default globalErrorHandler;