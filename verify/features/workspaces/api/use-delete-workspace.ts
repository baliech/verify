import {useMutation} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from "@/lib/rpc";
import { json } from "stream/consumers";
import { toast } from "sonner";
import {useQueryClient} from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["$delete"]>;



export const useDeleteWorkspace =()=>{
   
   const queryClient = useQueryClient();
    const mutation =useMutation<
       ResponseType,
       Error,
       RequestType
    
    >({
         mutationFn:async({param})=>{
            const responses = await client.api.workspaces[":workspaceId"]["$delete"]({param});

            if (!responses.ok){
               throw new Error("Failed to delete workspace")
            };
            return await responses.json();
         },
         onSuccess: ({data})=>{
           toast.success("Workspace deleted😎")
            queryClient.invalidateQueries({queryKey: ["workspaces"]});
            queryClient.invalidateQueries({queryKey: ["workspace", data.$id]});
         },
         onError:()=>{
            toast.error("Failed to delete workspace")
         }
    });
    return mutation;
}