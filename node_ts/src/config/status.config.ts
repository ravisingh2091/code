const STATUS = {
    INVALID_FILE: {
        STATUS: 400,
        MESSAGE: 'Invalid file'
    },
    VALIDATION: {
        STATUS: 400,
        MESSAGE: 'Validation failed'
    },
    FILE_REQUIRED: {
        STATUS: 400,
        MESSAGE: 'File is required'
    },
    RESOURCE_NOT_FOUND: {
        STATUS: 404,
        MESSAGE: 'Resource not found'
    },
    DEFAULT_ERROR: {
        STATUS: 500,
        MESSAGE: 'Something Went Wrong'
    }
}

export default STATUS;