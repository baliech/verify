import { UserButton } from "@/features/auth/components/user-button";
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
                 <h1 className="text-2xl">
    <span className="font-thin">Claims</span>
    <span className="font-bold">Verification</span>
  </h1>
                 
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
