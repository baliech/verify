"use client"
import { ResposiveModal } from "@/components/responsive-modal";
import { CreateProjectForm } from "./create-project-form"; 
import { useCreateProjectModal } from "../hook/use-create-project-modal";




export const CreateProjectModal = ()=>{

    const {isOpen,setIsOpen, close}= useCreateProjectModal();
    return(
        <ResposiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateProjectForm onCancel={close}/>
        </ResposiveModal>
    )
}