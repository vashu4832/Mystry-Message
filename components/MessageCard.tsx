import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { toast } from "./ui/toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

function MessageCard({message, onMessageDelete}: MessageCardProps) {
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id.toString()}`)
            toast.add({
                title: response.data.message,
            })
            onMessageDelete(message._id.toString())
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.add({
                title: axiosError.response?.data.message ?? "Failed to delete message"
            })
        }
    }

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          {new Date(message.createdAt).toLocaleString()}
        </CardDescription>
        <CardAction>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" size="icon" className="bg-red-500"><X className="w-4 h-4 text-white"/></Button>} />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>
      <CardContent>{message.content}</CardContent>
    </Card>
  );
}

export default MessageCard;