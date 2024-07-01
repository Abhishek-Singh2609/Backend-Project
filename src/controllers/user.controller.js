import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
  // console.log('Request body:', req.body); // For debugging
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
  const {fullname,email , username,password} = req.body;
  console.log("Eamil :", email);
  console.log("passcode :",password);
// We can check using if else for whole  validation- not empty 
// if (fullname ==="") {
// throw new ApiError(400,"fullname is required")
    
// }

if (
    [fullname,email, username,password].some((fields)=>
    fields?.trim()==="")
) {
    throw new ApiError(400,"All fields are rquired")
}
const existedUser = User.findOne({
    $or:[{username},{email} ]
    
});
console.log(existedUser);

if (existedUser) {
    throw new ApiError(409,"User with given eamil or username is already exist")
}
const avatarLocapath = req.files?.avatar[0]?.path;
console.log(avatarLocapath);
const coverImageLocalPath = req.files?.coverImage[0]?.path;
console.log(coverImageLocalPath);

if (!avatarLocapath) {
    throw new ApiError(400, "Avatar is required")
    
}
if (!coverImageLocalPath) {
    throw new ApiError(400, "Please upload coverImage")
    
}
const avatar= await uploadOnCloudinary(avatarLocapath)
console.log(avatar);

const coverImage =await uploadOnCloudinary(coverImageLocalPath)
console.log(coverImage);

// here we again check avatar is uploaded on cloudianry or not because it's required field 
if (!avatar) {
    throw new ApiError(400, "Avatar is required");
}

const savedUser = await User.create({
    fullname,
    // We already check and confirm avatar is uploaded because it's a required field
    avatar :avatar.url,
    //here we are not sure coverImage is available or not thats why we check here if available then save it in database
    coverImage:coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
})
console.log(savedUser);

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
export { registerUser };
