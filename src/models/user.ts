import mongoose, { Schema, Document } from "mongoose";


export interface Message extends Document {
    content: string;
    createdAt: Date;
}


export interface User extends Document {
    username: string;
    password: string;
    email: string;
    verifyCode: string;
    verifyCodeExpires: Date;
    isverified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}


const messageSchema = new Schema<Message>({
    content: {
        type: String,
        required: true 
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const userSchema = new Schema<User>({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true , "Password is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    verifyCode: {
        type: String,
        required: true
    },
    verifyCodeExpires: {
        type: Date,
        required: true
    },
    isverified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [messageSchema]

}, { timestamps: true });





const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema);
export default UserModel;


