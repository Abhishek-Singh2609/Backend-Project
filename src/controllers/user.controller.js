import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerUser = asyncHandler(async (req, res) => {
//   console.log('Request body:', req.body); // For debugging
  // res.status(200).json({
  //     message:"Finally error solved"
  // })

  // STEPS-by Step: What we have to do.
  // get user details from frontend
  // validation- not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res
  const {fullName,email , username,password} = req.body;
//   console.log(req.body);
//   console.log("Eamil :", email);
//   console.log("passcode :",password);
// We can check using if else for whole  validation- not empty 
// if (fullName ==="") {
// throw new ApiError(400,"fullName is required")
    
// }

if (
    [fullName,email, username,password].some((fields)=>
   !fields|| fields?.trim()==="")
) {
    throw new ApiError(400,"All fields are rquired")
}
const existedUser = await  User.findOne({
    $or:[{username},{email} ]
    
});
console.log("existedUser :",existedUser);

if (existedUser) {
    throw new ApiError(409,"User with given eamil or username is already exist")
}
// console.log(req.files);
// add checks to ensure req.files.avatar is defined before trying to access their properties.
if (!req.files?.avatar || !req.files.avatar[0]) {
    throw new ApiError(400, "Avatar is required")
}
const avatarLocapath = req.files?.avatar[0]?.path;
// console.log("avatarlocalPath :",avatarLocapath);
// const coverImageLocalPath = req.files?.coverImage[0]?.path;
// console.log("coverImagelocalPath :",coverImageLocalPath);

// anoter way to check coverImage is available or not in this way we can also check for avatar
let coverImageLocalPath;
if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
}

const avatar= await uploadOnCloudinary(avatarLocapath)
console.log(avatar);

const coverImage =await uploadOnCloudinary(coverImageLocalPath)
// console.log(coverImage);

// here we again check avatar is uploaded on cloudianry or not because it's required field 
if (!avatar) {
    throw new ApiError(400, "Avatar is required");
}

const savedUser = await User.create({
    fullName,
    // We already check and confirm avatar is uploaded because it's a required field
    avatar :avatar.url,
    //here we are not sure coverImage is available or not thats why we check here if available then save it in database
    coverImage:coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
})
console.log("savedUser:",savedUser);

// Here we check or confirm user i.e.,savedUser is created or not in database
const createdUser = await User.findById(savedUser._id).select(
    "-password -refreshToken"
)
console.log("createdUser :",createdUser);
if (!createdUser) {
    throw new ApiError(500, "Something went wrong while we registering the User")
    
}
return res.status(201).json(
    new ApiResponse(200, createdUser, "User Registered Successfully")
)

});


const loginUser = asyncHandler(async (req,res)=>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie
    
    const {email, username, password} = req.body
    console.log(email);
    
    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
        //     throw new ApiError(400, "username or email is required")
        
        // }
        
        const user = await User.findOne({
            $or: [{username}, {email}]
        })
        
        if (!user) {
            throw new ApiError(404, "User does not exist")
        }
        
        const isPasswordValid = await user.isPasswordCorrect(password)
        
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials")
        }
        
        const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
        
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
        
        const options = {
            httpOnly: true,
            secure: true
        }
        
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
        )
    )
    
})
const logoutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))

})
export { registerUser, loginUser, logoutUser };