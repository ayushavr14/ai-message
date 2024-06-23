import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 90000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail?.isVerified) {
        return Response.json(
          { success: false, message: "User already exists with this email" },
          { status: 500 }
        );
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
      }
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();

      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      );
      if (emailResponse.success) {
        return Response.json(
          { success: false, message: emailResponse.message },
          { status: 500 }
        );
      }
    }
    return Response.json(
      { success: true, message: "Registering User Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error, "Error registering user");
    return Response.json(
      { success: false, message: "Error Registering User" },
      { status: 500 }
    );
  }
}
