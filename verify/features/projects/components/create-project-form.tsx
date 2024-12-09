"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Children } from "react"
import { useForm } from "react-hook-form";
import { createProjectSchema } from "../schema";
import { z } from "zod";
import { Card,CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form,FormControl,FormItem,FormLabel, FormMessage, } from "@/components/ui/form";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateProject } from "../api/use-create-projects";
import { useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image"
import { FormField } from "@/components/ui/form";
import { ImageIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

interface CreateProjectFormProps {
    onCancel?: ()=> void ;
};



export const CreateProjectForm =({onCancel}: CreateProjectFormProps)=>{
    const workspaceId = useWorkspaceId();
     const router = useRouter();
     const {mutate, isPending } = useCreateProject()
     const inputRef = useRef<HTMLInputElement>(null)
    const form = useForm<z.infer<typeof createProjectSchema>>({
       resolver:zodResolver(createProjectSchema.omit({workspaceId:true})), });
    const onSubmit = (values:z.infer<typeof createProjectSchema>)=>{
         const finalValues ={
            ...values,
            workspaceId,
            image: values.image instanceof File? values.image :""
             


         } 
        
        mutate({form:finalValues},{
            onSuccess: ({data})=>{
                form.reset();
                
                router.push(`/workspaces/${workspaceId}/projects/${data.$id}`)
            }
        });
    };

    const  handleImageChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0];
        if(file){
            form.setValue("image", file);
        }
    }

    return (
    <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex p-7">
            <CardTitle className="text-xl font-bold">
                Member Projects
            </CardTitle>
        </CardHeader>
        <div className="px-7">
            <DottedSeparator/>

        </div>
        <CardContent className="p-7">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-y-4">
                    <FormField
                    
                    control={form.control}
                    name="name"
                    render={({field}) => (

                        <FormItem>
                            <FormLabel>
                                email
                            </FormLabel>
                            <FormControl>
                                <Input

                                {...field}
                                type="email"
                                placeholder="Enter email"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField
                    control={form.control}
                    name="image"
                    render={({field})=>(
                        <div className="flex flex-col gap-y-2">
                               <div className="flex items-center gap-x-5">
                               {field.value ? (
                                  <div className="size-[72px] relative rounded-md overflow-hidden">
                                    <Image 
                                    alt="Logo"
                                    fill
                                     src={
                                       field.value instanceof File?
                                       URL.createObjectURL(field.value):
                                       field.value
                                     }/>
                                    </div>
                                      ):(
                                        <Avatar className="w-[72px] h-[72px] bg-neutral-200 rounded-full flex items-center justify-center">
                                             <ImageIcon className="w-[36px] h-[36px] text-neutral-400" />
                                        </Avatar>

                                      )}
                                      <div className="flex flex-col ">
                                        <p className="text-sm">project icon(optional)</p>
                                            <p className="text-xs font-bold text-black">
                            <span className="text-xs font-normal text-muted-foreground">
                                Supported images:
                            </span>{" "}
                            JPG, PNG, JPEG  max 1MB
                            </p>
                                        <input className="hidden"
                                        type="file"
                                        ref={inputRef}
                                        onChange={handleImageChange}
                                        disabled={isPending}
                                        /> 
                                        {field.value? (
                                        <Button type="button"
                                        disabled={isPending}
                                        variant="destructive"
                                        size="xs"
                                        className="w-fit mt-2"
                                        onClick={()=>{field.onChange(null);
                                            if (inputRef.current){
                                                inputRef.current.value="";
                                            }
                                        }}>
                                            replace
                                        </Button>) : (

                                            <Button type="button"
                                            disabled={isPending}
                                            variant="teritary"
                                            size="xs"
                                            className="w-fit mt-2"
                                            onClick={()=>inputRef.current?.click()}>
                                                Upload Image
                                            </Button>

                                        )}
                                        </div>
                                     </div>
                                      </div>

                    )}
                    
                    />
                    <DottedSeparator className="py-7"/>
                    <div className="flex items-center justify-between">
                    <Button 
                    type="button"
                    size="lg"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isPending}
                    className={cn(!onCancel && "invisible")}>
                       Cancel
                    </Button>
                    <Button 
                    type="submit"
                    size="lg"
                    disabled={isPending}
                    >
                       Create Project
                    </Button>
                    </div>
                    </div>
                </form>

            </Form>

        </CardContent>

    </Card>

    )
};