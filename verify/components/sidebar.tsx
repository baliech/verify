import Link from "next/link";
import { DottedSeparator } from "./ui/dotted-separator";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import Projects from "./projects";

export const Sidebar =()=>{
    return(
        <aside className="bg-purple-50 h-full p-4 w-full">
            <Link href="/">
           <h1 className="text-2xl">
    <span className="font-thin">Claims</span>
    <span className="font-bold">Verification</span>
  </h1>
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
