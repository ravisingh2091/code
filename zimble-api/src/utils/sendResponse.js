export function sendResponse(res, statusCode, details = {}, message) {
    if (typeof statusCode !== 'number') {
        throw new Error('statusCode should be a number');
    }

    // status variable to store the status of the response either success or failed
    let status = null;

    // regex pattern to validate that the status code is always 3 digits in length
    const lengthPattern = /^[0-9]{3}$/;

    // check for the length of the status code, if its 3 then set default value for status as
    // failed
    // else throw an error
    if (!lengthPattern.test(statusCode)) {
        throw new Error('Invalid Status Code');
    }

    // regex to test that status code start with 2 or 3 and should me 3 digits in length
    const pattern = /^(2|3)\d{2}$/;

    // if the status code starts with 2, set satus variable as success
    pattern.test(statusCode) ? (status = 'success') : (status = 'failed');

    return res.status(statusCode).json({
        status,
        details,
        message
    });
}

export function handleCustomThrow(res, error) {
    // eslint-disable-next-line no-console
    console.error({ error });

    try {

        if (isNaN(error.code)) {
            throw "Something went wrong"
        }

        if (error.code === 400) {
            return sendResponse(res, error.code, {}, error.msg);
        }
        if (error.code === 401) {
            return sendResponse(res, error.code, {}, error.msg);
        }
        if (error.code === 403) {
            return sendResponse(res, error.code, {}, error.msg);
        }
        if (error.code === 404) {
            return sendResponse(res, error.code, {}, error.msg);
        }
        if (error.code === 550) {
            return sendResponse(res, error.code, {}, error.msg);
        }

    } catch (err) {
        // throw new Error(err);
        return sendResponse(res, 500, {}, 'Something went wrong');
    }
}