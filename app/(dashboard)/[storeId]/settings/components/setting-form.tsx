"use client";

import { Store } from ".prisma/client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator"
import * as z from "zod";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormLabel, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1)
})

type SettingFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {

  const [open, setOpen] = useState(false);
  const [loading, setLoading]= useState(false);

  const form = useForm<SettingFormValues>({
    resolver : zodResolver(formSchema),
    defaultValues: initialData
  })


  const params = useParams()
  const router = useRouter()

  const onSubmit = async (data:SettingFormValues) =>{
    // console.log(data)
    try{
      setLoading(true)
      await axios.patch(`/api/stores/${params.storeId}`, data)
      router.refresh()
      toast.success("Store updated successfully")
    }catch(error){
      toast.error("Something went wrong"); 
    }finally{
      setLoading(false)
    }

  }

  const onDelete = async () =>{
     try{
      setLoading(true)
      await axios.delete(`/api/stores/${params.storeId}`)
      router.refresh()
      router.push("/")
      toast.success("Store deleted successfully.")
     }catch(error){
      toast.error("Make sure you removed all products and categories fist.")
     }finally{
      setLoading(false)
      setOpen(false)
     }
  }

  return (
    <>
      <AlertModal  
        isOpen={open}
        onClose={()=> setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between ">
        <Heading title="Settings" description="Manage store settings" />
        <Button variant="destructive" disabled={loading} size="sm" onClick={() => {setOpen(true)}}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[20%]">
          <div className="grid grid-col-3 gap-8">
              <FormField 
                control = { form.control}
                name="name"
                render = {({field})=>(
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input  disabled={loading} placeholder="Store-name" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public"/>
    </>
  );
};
