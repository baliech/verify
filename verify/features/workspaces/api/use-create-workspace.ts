import {useMutation} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from "@/lib/rpc";
import { json } from "stream/consumers";
import { toast } from "sonner";
import {useQueryClient} from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.workspaces["$post"]>;
type RequestType = InferRequestType<typeof client.api.workspaces["$post"]>;



export const useCreateWorkspace =()=>{
   
   const queryClient = useQueryClient();
    const mutation =useMutation<
       ResponseType,
       Error,
       RequestType
    
    >({
         mutationFn:async({form})=>{
            const responses = await client.api.workspaces["$post"]({form});

            if (!responses.ok){
               throw new Error("Failed to create workspace")
            };
            return await responses.json();
         },
         onSuccess: ()=>{
           toast.success("Workspace created😎")
            queryClient.invalidateQueries({queryKey: ["workspaces"]});
         },
         onError:()=>{
            toast.error("Failed to create workspace")
         }
    });
    return mutation;
}