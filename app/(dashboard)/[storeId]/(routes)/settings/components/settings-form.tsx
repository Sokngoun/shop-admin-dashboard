"use client"

import { Store } from ".prisma/client"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Trash } from "lucide-react"

interface SettingsFormProps{
    initialData: Store
}

export const SettingsForm:React.FC<SettingsFormProps> = ({
    initialData
}) =>{
    return (
        <div className="flex items-center justify-between ">
           <Heading 
                title = "Settings"
                description = "Manage store settings" 
           />
           <Button
                variant="destructive"
                size = "sm"
                onClick={()=>{}}
           >
                <Trash className="h-4 w-4" />
           </Button>
        </div>
    )
}   