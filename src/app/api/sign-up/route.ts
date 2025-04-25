import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmials";


export async function POST(request: Request) {
    await dbConnect();

    try {

        const { username, email, password } = await request.json();
        const existinguser = await UserModel.findOne({
            username,
            isverified: true
        })


        if (existinguser) {
            return Response.json({
                success: false,
                message: "User already exists",
            },{status: 400})
        }

        const existingEmail = await UserModel.findOne({
            email,
            isverified: false
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingEmail) {

            if (existingEmail.isverified) {
                return Response.json({
                    success: false,
                    message: "User already exists with this email",
                },{status: 400})
            }else{
                const hashpassword =  await bcrypt.hash(password, 10)
                existingEmail.password = hashpassword;
                existingEmail.verifyCode = verifyCode;
                existingEmail.verifyCodeExpires = new Date(Date.now() + 60 * 60 * 1000);
                await existingEmail.save();
            }

        }else{
          const hashpassword =  await bcrypt.hash(password, 10)
          const expirydate = new Date(Date.now() + 60 * 60 * 1000);
          
           const newUser=  new UserModel({
            username,
                password: hashpassword,
                email,
                verifyCode: verifyCode,
                verifyCodeExpires: expirydate,
                isverified: false,
                isAcceptingMessage: true,
                messages: [],
          })

          await newUser.save();

        }


       const emailResponse = await sendVerificationEmail(email, username, verifyCode);

       if(!emailResponse.success){
        return Response.json({
            success: false,
            message: "Failed to send verification email",
        },{status: 500})
       }

        return Response.json({
            success: true,
            message: "User created successfully",
        },{status: 201})


    } catch (error) {
        console.error("Error creating user:", error);
        return Response.json({
            success: false,
            message: "Internal server error",
        },
            {
                status: 500,
            }
        );
    }
}
