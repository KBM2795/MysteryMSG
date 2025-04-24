import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import {z} from "zod";
import {usernameValidation} from "@/schemas/signupSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation,
})

export async function GET(request: Request) {

     await dbConnect();
     
     try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }

        const result = UsernameQuerySchema.safeParse(queryParam);
 
        console.log(result); //TODO: remove this line

        if(!result.success){
          const usernameError = result.error.format().
          username?._errors  || []

          return Response.json({
            success: false,
            message: usernameError?.length > 0 ? usernameError.join(', ') : "Invalid username",
          },
          {
            status: 400
          })
        }

        const {username} = result.data;

        const existingVerifiedUser = await User.findOne({username, isverified: true});
        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: "Username already exists",
            },
            {
                status: 409
            })
        }

        return Response.json({
            success: true,
            message: "Username is available",
        },{
            status: 200
        })


        
     } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Error checking username",
        },
    {
        status: 500
    })
     }
}

