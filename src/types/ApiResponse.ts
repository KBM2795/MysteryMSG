import { Message } from "@/models/user";

export interface ApiResponse{
    sucess: boolean;
    message: string;
    isAceptingMessages?: boolean;
    messages?: Array<Message>;
}

