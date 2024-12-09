"use client";

import {FcGoogle} from "react-icons/fc"
import {FaGithub} from "react-icons/fa"
import Image from "next/image";
import {Card,CardContent,CardHeader,CardTitle} from "@/components/ui/card"
import { DottedSeparator } from "@/components/ui/dotted-separator"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {z} from "zod";
import {zodResolver}from "@hookform/resolvers/zod";
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { LoginSchema } from "../schemas";
import { useLogin } from "../api/use-login";
import { IoPeople } from "react-icons/io5";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";


export const SignInCard =()=>{
 const {mutate, isPending}= useLogin();   
const form = useForm<z.infer<typeof LoginSchema>>({
    resolver:zodResolver(LoginSchema),
    defaultValues:{
        email:"",
        password:"",
    }
})

const onSubmit = (values:z.infer<typeof LoginSchema>)=>{
    mutate({json:values});
};


return(
    <Card className="w-full h-full md:w-[487px] border-none shadow-none ">
        <CardHeader className="flex items-center justify-center text-center">
            <CardTitle className="flex items-center justify-center text-center text-3xl">
                
            </CardTitle>
            <CardContent className="flex items-center justify-center text-center text-2xl ">
            <div>
            <Avatar className="w-[58px] h-[58px] bg-blue-200 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
        </Avatar>
           <p className="text-sm mt-2">sign in</p> 
          </div>
            </CardContent>
            
        </CardHeader>
        
        
        <CardContent className="">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                placeholder="Enter password"
                
                />
                </FormControl>
                <FormMessage/>
               </FormItem>)}/>
               
                <Button disabled={isPending} size="lg" className="w-full" >
                    login
                </Button>
            </form>
            </Form>

        </CardContent>
    
        
        
        {/* <CardContent className="flex items-center justify-center  w-full">
            <Button variant="secondary" size="lg" className="mr-2" disabled={isPending}>
                <FcGoogle className="mr-2 size-5"/>
                login with Google
            </Button>
            <Button variant="secondary" size="lg" className="" disabled={isPending}>
            <FaGithub className="mr-2 size-5"/>
                login with Github
            </Button>

        </CardContent> */}
        <CardContent className=" flex items-center justify-center">
            
                <Link href="/sign-up" className="text-sm">
                <span style={{ color: 'blue' }}>&nbsp;Sign Up</span>
                </Link>
        
        </CardContent>

    </Card>
   
    );



};