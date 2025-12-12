

export class ApiError extends Error {
    constructor(
        message: string, 
        public status?: number, 
        public data?: unknown
    ){
        super(message)
        this.name = 'ApiError'
    }
}

export class AuthenticationError extends ApiError {
    constructor(message: string = 'No autenticado'){
        super(message, 401);
        this.name = 'AuthenticationError'
    }
}

export class ForbiddenError extends ApiError {
    constructor(message: string = 'Sin permisos'){
        super(message, 403)
        this.name = 'ForbiddenError'
    }
}

export class NotFoundError extends ApiError{
    constructor(message: string = 'Recurso no encontrado'){
        super(message, 404)
        this.name = 'NorFoundError'
    }
}