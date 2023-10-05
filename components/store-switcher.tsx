"use client";

import { Store } from "@prisma/client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useStoreModal } from "@/hook/use-store-modal";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Check, ChevronDown, PlusCircle, Store as StoreIcon } from "lucide-react"
import { cn } from "@/lib/utils";
import { Command, CommandInput, CommandList } from "@/components/ui/command";
import { CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "cmdk";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

const StoreSwitcher = ({
  className,
  items = [],
}: StoreSwitcherProps) => {
    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();
    const formattedItems = items.map((item)=>({
        label: item.name,
        value: item.id
    }))
    const [open,setOpen] = useState(false);
    const currentStore = formattedItems.find((item)=> item.value === params.storeId);
    
    const onStoreSelect = (store:{value: string,label:string})=>{
        setOpen(false);
        router.push(`/${store.value}`);
    }
  return (
    <Popover open={open} onOpenChange={setOpen} >
        <PopoverTrigger asChild>
            <Button
                variant="outline"
                size="sm"
                role="combobox"
                aria-expanded={open}
                aria-label="Selct a store"
                className={cn("w-[200px] justify-between", className)}
            > 
               <StoreIcon size={24} className="mr-2 h-4 w-4" /> 
               {currentStore?.label}
               <ChevronDown size={24} className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandInput placeholder="Search store..."/>
                <CommandEmpty>No store found.</CommandEmpty>
                <CommandGroup heading="Stores" className="p-2 space-y-2">
                  {formattedItems.map((store)=>(
                    <CommandItem
                      key={store.value}
                      onSelect={()=>onStoreSelect(store)}
                      className="text-sm flex hover:cursor-pointer space-y-2 px-2 py-1 items-center hover:bg-gray-100 rounded-md"
                    >
                      <StoreIcon className="mr-2 h-4 w-4" />
                      {store.label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4 flex items-center",
                          currentStore?.value === store.value
                            ? "opacoty-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
              <CommandSeparator />
              <CommandList>
                <CommandGroup className="px-2 hover:cursor-pointer">
                  <CommandItem
                  className="flex"
                    onSelect = {() => {
                      setOpen(false)
                      storeModal.onOpen();
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                  Create Store
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
  )
}


export default StoreSwitcher;