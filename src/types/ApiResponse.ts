import { Message } from "@/models/user";

export interface ApiResponse{
    success: boolean;
    message: string;
    isAceptingMessages?: boolean;
    messages?: Array<Message>;
}

