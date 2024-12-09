import Link from "next/link";
import { DottedSeparator } from "./ui/dotted-separator";
import { Navigation } from "./navigation";
import Image from "next/image";
import { WorkspaceSwitcher } from "./workspace-switcher";
import Projects from "./projects";

export const Sidebar =()=>{
    return(
        <aside className="bg-purple-50 h-full p-4 w-full">
            <Link href="/">
            <h1 className="flex justify-start items-center text-2xl text-black"><Image src="/logo.png" alt="logo" height={58} width={58}/></h1>
            </Link>
            <DottedSeparator className="my-4"/>

            <WorkspaceSwitcher/>
            <DottedSeparator className="my-4"/>
            <Navigation/>
            <DottedSeparator className="my-4"/>
            <Projects/>
        </aside>
    );
};