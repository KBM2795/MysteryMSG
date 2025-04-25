import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import {User} from "next-auth"
import mongoose from "mongoose";


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

     const userId = new mongoose.Types.ObjectId(user._id)

     try {

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        const user = await UserModel.updateOne({_id: userId} , {
            $pull:{
                messages:{
                    _id: id
                }
            }
        });

        if (!user) {
            return Response.json({
                success: false,
                message: "user not found",
            }, { status: 401 });    
        }

        return Response.json({
            success: true,
            message : "Message Deleted Successfully"
        }, { status: 200 }); 
        

     } catch (error) {
        console.log("Error deleting messages", error);
        return Response.json({
            success: false,
            message: "failed to delete message",
        }, { status: 500 });
        
     }
}