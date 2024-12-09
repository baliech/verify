import {useMutation} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from "@/lib/rpc";
import { json } from "stream/consumers";
import { toast } from "sonner";
import {useQueryClient} from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["join"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["join"]["$post"]>;



export const useJoinWorkspace =()=>{
   
   const queryClient = useQueryClient();
    const mutation =useMutation<
       ResponseType,
       Error,
       RequestType
    
    >({
         mutationFn:async({param, json})=>{
            const responses = await client.api.workspaces[":workspaceId"]["join"]["$post"]({param, json});

            if (!responses.ok){
               throw new Error("Failed to Join wprkspace")
            };
            return await responses.json();
         },
         onSuccess: ({data})=>{
           toast.success("Joined workspace😎")
            queryClient.invalidateQueries({queryKey: ["workspaces"]});
            queryClient.invalidateQueries({queryKey: ["workspace", data.$id]});
         },
         onError:()=>{
            toast.error("Failed to Join workspace")
         }
    });
    return mutation;
}