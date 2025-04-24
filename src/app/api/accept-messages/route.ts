import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import {User} from "next-auth"

export async function POST(request: Request) {
    await dbConnect();

     const session = await  getServerSession(authOptions)
     const user= session?.user as User;

     if (!session || !user) {
        return Response.json({
            success: false,
            message: "Unauthorized User",
        }, { status: 401 });
     }

     const userId = user._id

     const{acceptMessages}= await request.json()

     try {
        
        const updatedUser =  await UserModel.findByIdAndUpdate(userId, {isAcceptingMessage : acceptMessages}, { new: true });
 
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "fialed to update user accept messages",
            }, { status: 401 });
        }

        return Response.json({
            success: true,
            message: "user accept messages updated successfully",
            updatedUser
        }, { status: 200 });

     } catch (error) {
        console.log("Error updating user accept messages", error);
        return Response.json({
            success: false,
            message: "failed to update user accept messages",
        }, { status: 500 });
     }

        
}



export async function GET(request: Request) {
    await dbConnect();

    const session = await  getServerSession(authOptions)
    const user= session?.user as User;

    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Unauthorized User",
        }, { status: 401 });
     }

     const userId = user._id

     try {
        
        const User =  await UserModel.findById(userId);
 
        if (!User) {
            return Response.json({
                success: false,
                message: "failed to find user",
            }, { status: 401 });
        }

        return Response.json({
            success: true,
            isAcceptingMessages: User.isAcceptingMessage,
        }, { status: 200 });

     } catch (error) {
        console.log("failed to find accept messages of user", error);
        return Response.json({
            success: false,
            message: "failed to find accept messages of user",
        }, { status: 500 });
     }
}