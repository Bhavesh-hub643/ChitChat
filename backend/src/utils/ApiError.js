class ApiError extends Error{
    constructor(
        statusCode,
        data,
        message= "Something went wrong!",
        errors= [],
        stack=""
    ){
        super(message)
        this.data= data,
        this.statusCode= statusCode
        this.errors= errors
        
        if(stack) this.stack= stack
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}