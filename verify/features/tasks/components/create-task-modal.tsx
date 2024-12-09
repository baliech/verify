"use client"

import { ResposiveModal } from "@/components/responsive-modal";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { CreateTaskForm} from "./create-task-form"



export const CreateTaskModal = ()=>{
   const {isOpen , setIsOpen, close }= useCreateTaskModal();

   return(
    <ResposiveModal open={isOpen} onOpenChange={setIsOpen}>
    <CreateTaskForm onCancel={close}/>
    </ResposiveModal>
   )
}