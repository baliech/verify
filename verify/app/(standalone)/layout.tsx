import { UserButton } from "@/features/auth/components/user-button";
import Image from "next/image";
import Link from "next/link";
interface StandAloneLayoutProps {
    children:React.ReactNode;
}

const StandAloneLayout =({children}:StandAloneLayoutProps)=>{

 return (
      <main className="bg-neutral-100 min-h-screen">
        <div  className="mx-auto max-w-screen-2xl p-4">
            <nav className="flex justify-between items-center h-[73px]">
                 <Link href="/">
                 <h1 className="flex  items-center text-2xl text-black"><Image src="/logo.png" alt="logo" height={64} width={64}/></h1>
                 
                 </Link>
                 <UserButton/>
            </nav>
        <div className="flex flex-col items-center justify-center py-4">
        {children}
        </div>
        </div>
      </main>
 );

}
export default StandAloneLayout;