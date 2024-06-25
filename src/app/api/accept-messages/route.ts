import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";

export async function POST(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;
  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userId = user._id;
  const { acceptMessages } = await req.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true, projection: { password: false } }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to accept user status to accept messages",
        },
        {
          status: 500,
        }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "Message acceptance status updation successfully",
          updatedUser,
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.log("Failed to accept user status to accept messages", error);
    return Response.json(
      {
        success: false,
        message: "Failed to accept user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;
  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error, "Error in getting messages");
    return Response.json(
      {
        success: false,
        message: "Failed to getting user messages",
      },
      {
        status: 500,
      }
    );
  }
}
