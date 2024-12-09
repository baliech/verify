"use client";

import {Card, CardContent, CardDescription,CardHeader, CardTitle} from "@/components/ui/card"
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { useInviteCode } from "../hooks/use-invite-code";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useRouter } from "next/navigation";

interface JoinWorkspaceFormProps{
    initialValues:{
        name:string,

    };
}


export const JoinWorkspaceForm = ({initialValues,}:JoinWorkspaceFormProps)=>{
     const inviteCode = useInviteCode();
    const {mutate, isPending} = useJoinWorkspace();
    const workspaceId = useWorkspaceId();
    const router = useRouter();

    const onSubmit =()=>{
        mutate({
            param:{workspaceId},
            json:{code:inviteCode}
    },{
        onSuccess:({data})=>{
          router.push(`/workspaces/${data.$id}`)
        },
    });
    }
return(
    <Card className="w-full h-full border-none shadow-none"> 
    <CardHeader className="p-7">
        <CardTitle className=" text-xl font-bold">
            Join workspace

        </CardTitle>
        <CardDescription className="">
            You&apos;ve been invited to join <strong>{initialValues.name}</strong> workspace.

        </CardDescription>

    </CardHeader>
    <div className="px-7">
        <DottedSeparator/>
        <CardContent className="p-7 ">
            <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
                <Button className="w-full lg:w-fit"
                variant="secondary"
                type="button"
                asChild
                size="lg"
                disabled={isPending}>
                    <Link href="/">
                    cancel
                    </Link>
                  
                </Button>
                <Button className="w-full lg:w-fit"
                size="lg"
                type="button"
                onClick={onSubmit}
                disabled={isPending}>
                  join workspace
                </Button>

            </div>
        </CardContent>

    </div>


    </Card>
)
}