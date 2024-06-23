import { Message } from "@/model/user";
export type ApiResponse = {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
};
