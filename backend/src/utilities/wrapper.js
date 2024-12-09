export const wrapperFunction = (func) => {
    return async (req , res, next) => {
        try {
             return await func(req, res, next)
        } catch (error) {
            console.error("error:", error)
            next(error)
        }
    }
}

