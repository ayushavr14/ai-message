import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    const result = usernameQuerySchema?.safeParse(queryParams);
    console.log(result);
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(",")
              : "Invalid paramater",
        },
        {
          status: 400,
        }
      );
    }
    const { username } = result?.data;
    const existitngVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existitngVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "Username is unique",
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.log(error, "Checking username error");
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
