"use client"

import Image  from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";


interface AuthLayoutProps {
 
children: React.ReactNode;


};


 const AuthLayout =({children}: AuthLayoutProps)=>{
    
   const pathname = usePathname();
   const isSignIn = pathname === "/sign-in";

return(

    <main className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-700 via-violet-800 to-fuchsia-900 min-h-screen">
      <div className="mx-auto max-w-screen-2xl  p-4 ">
        <nav className="flex justify-between items-center">
        <h1 className="flex justify-between items-center text-2xl text-white"><image src="/logo-w.png" alt="logo" height={58} width={58}/></h1>
        <Button variant="secondary">
            <Link href={isSignIn?"/sign-up":"/sign-in"}>
            {isSignIn?"Sign Up":"Sign In"}
            </Link>
        </Button>
            
        
            

            

        </nav>
        <div className=" flex items-center justify-center  p-4">
            {children}
            </div>

      

      </div>
    

      
    </main>




)
 }
 export default AuthLayout;
