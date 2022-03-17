class BadRequestError extends Error {
    get Status() {this.status}
    constructor(message, options = {msg: 'Bad Request'}) {
        super(message) ;
        this.status = 400
        for (const key in options) {
            this[key] = options[key]
        }
    }
}

class NotFoundError extends Error {
    get Status() {return 404}
    constructor(message, options = {msg: 'Not Found'}) {
        super(message) ;
        for (const key in options) {
            this[key] = options[key]
        }
    }
}

class ConflictError extends Error {
    get Status() {return 409}
    constructor(message, options = {msg: 'Already Exist'}) {
        super(message) ;
        for (const key in options) {
            this[key] = options[key]
        }
    }
}

class InternalError extends Error {
    get Status() {return 500}
    constructor(message, options = {msg: 'Ups something went wrong, please try again later'}) {
        super(message) ;
        for (const key in options) {
            this[key] = options[key]
        }
    }
}

module.exports = {
    BadRequestError,
    NotFoundError,
    ConflictError,
    InternalError
}
