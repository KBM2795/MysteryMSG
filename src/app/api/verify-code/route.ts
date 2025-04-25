import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";



export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();
        const deocodeUsername = decodeURIComponent(username);

        const user = await User.findOne({username: deocodeUsername})

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },{
                    status: 500
                }
            )
        }        
        
        
        const isCodeValid = user.verifyCode == code
        const isCodeNotExpired = new Date(user.verifyCodeExpires) > new Date()

        if(isCodeNotExpired && isCodeValid){
           user.isverified = true
           await user.save();

           return Response.json(
            {
                success: true,
                message: "User is now verified"
            },{
                status: 200
            }
        )
        }

        if(!isCodeNotExpired){
            return Response.json(
                {
                    success: false,
                    message: "code is expired please signup again"
                },{
                    status: 500
                }
            )
        }

        if(!isCodeValid){
            return Response.json(
                {
                    success: false,
                    message: "verification code is incorrect"
                },{
                    status: 500
                }
            )
        }

    } catch(error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Error verifying code",
        },
            {
                status: 500
            })
    }
}