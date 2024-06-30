// const asyncHandler = async (requestHandler)=>{
//  (req, res,next)=>{
//     Promise.resolve(requestHandler(res,res,next))
//     .catch((err)=> next(err))
//  }
// }
// export {asyncHandler}

// const asyncHandler = () => {}
// const asyncHandler = (func) => {() => {}}
// const asyncHandler = (func) => async () => {}

    // CODE WITH TRY AND CATCH
    const asyncHandler = (fn) => async (req,res ,next) => {
        try {
            await fn(req, res,next)
        } catch (error) {
            res.status(error.code || 500).json({
                success:false,
                message: error.message
            })
        }
    }
    export {asyncHandler}