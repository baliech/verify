"use client"

import {FcGoogle} from "react-icons/fc"
import {FaGithub} from "react-icons/fa"
import { IoPeople } from "react-icons/io5";

import {Card,CardContent,CardDescription,CardHeader,CardTitle} from "@/components/ui/card";
import { DottedSeparator } from "@/components/ui/dotted-separator"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {z} from "zod";
import {zodResolver}from "@hookform/resolvers/zod";
import { Form,FormControl,FormField,FormItem,FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { RegisterSchema } from "../schemas";
import { useRegister } from "../api/use-register";
import { User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";





export const SignUpCard =()=>{
    const {mutate,isPending} = useRegister();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver:zodResolver(RegisterSchema),
        defaultValues:{
            name:"",
            email:"",
            password:"",
        }
    })
    
    const onSubmit = (values:z.infer<typeof RegisterSchema>)=>{
        mutate({json:values});
    }

return(
    <Card className="w-full h-full md:w-[487px] border-none shadow-none  ">
   <CardHeader className="flex items-center justify-center text-center">
            <CardTitle className="flex items-center justify-center text-center text-3xl">
                
            </CardTitle>
            <CardContent className="flex items-center justify-center text-center text-2xl ">
            <div>
            <Avatar className="w-[58px] h-[58px] bg-blue-200 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
        </Avatar>
           <p className="text-sm mt-2">sign up</p> 
          </div>
            </CardContent>
            
        </CardHeader>
        
        
        <CardContent className="">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField 
                name="name"
                control={form.control}
                render={({field})=>(
                    <FormItem>
                        <FormControl>
                <Input
                {...field}
                type="text"
                placeholder="Enter your name"
                
                />
                </FormControl>
                <FormMessage/>
               </FormItem>)}/>



                   <FormField 
                name="email"
                control={form.control}
                render={({field})=>(
                    <FormItem>
                        <FormControl>
                <Input
                {...field}
                type="email"
                placeholder="Enter email address"
                
                />
                </FormControl>
                <FormMessage/>
               </FormItem>)}/>


               <FormField 
                name="password"
                control={form.control}
                render={({field})=>(
                    <FormItem>
                        <FormControl>
                <Input
                {...field}
                type="password"
                placeholder="Enter your password"
                
                />
                </FormControl>
                <FormMessage/>
               </FormItem>)}/>

                <Button disabled={isPending} size="lg" className="w-full">
                    create account
                </Button>
            </form>
          </Form>
        </CardContent>
        
        
        <CardContent className="flex items-center justify-center text-2xl">
        
                <Link href="/sign-in" className="text-sm">
                <span  style={{ color: 'blue' }}>&nbsp;sign in</span>
                </Link>
        
        </CardContent>

    </Card>
   
    );



};