import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { verifyCodeSchemaValidation } from "@/schemas/verifySchema";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, code } = await req.json();
    verifyCodeSchemaValidation.parse({
      verifyCode: code,
    });
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeNotExpired && isCodeValid) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired",
        },
        {
          status: 500,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Verification code is expired/incorrect",
        },
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    console.log(error, "Checking verifycode error");
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
