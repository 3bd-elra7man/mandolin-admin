"use client";

import { Trash } from "lucide-react"
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
} from "@/components/ui/alert-dialog"

import toast from "react-hot-toast";
import { useState } from "react";

interface DeleteProps {
  item: string;
  id: string;
}

const Delete: React.FC<DeleteProps> = ({ item, id }) => {
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true)
      const itemType = item === "product" ? "products" : "collections";
      const res = await fetch(`/api/${itemType}/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setLoading(false)
        window.location.href = (`/${itemType}`)
        toast.success(`${item} deleted successfully!`)
      }
    } catch (err) {
      console.log(err)
      toast.error("Something went wrong! Please try again.")
    }
  }
  return (
   <AlertDialog>
  <AlertDialogTrigger className="bg-red-1 text-white p-2 rounded" disabled={loading}>
    <Trash className="h-4 w-4" />
  </AlertDialogTrigger>
  <AlertDialogContent className="bg-white text-grey-1">
    <AlertDialogHeader>
      <AlertDialogTitle className="text-red-1">Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your {item}.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction className="bg-red-1 text-white" onClick={onDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  )
}

export default Delete
