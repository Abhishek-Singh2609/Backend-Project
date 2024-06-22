// const asyncHandler = async (requesthandler)=>{
//  (req, res,next)=>{
//     Promise.resolve(requesthandler(res,res,next))
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
            await fn(rew, res,next)
        } catch (error) {
            res.status(err.code || 500).json({
                success:false,
                message: err.message
            })
        }
    }
    export {asyncHandler}