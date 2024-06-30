import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req,res)=>{
    // console.log('Request body:', req.body); // For debugging
    res.status(200).json({
        message:"Finally error solved"
    })
})
export {registerUser}