import {useMutation} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from "@/lib/rpc";
import { json } from "stream/consumers";
import { toast } from "sonner";
import {useQueryClient} from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["$patch"],200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["$patch"]>;



export const useUpdateWorkspace =()=>{
   const router = useRouter();
   const queryClient = useQueryClient();
    const mutation =useMutation<
       ResponseType,
       Error,
       RequestType
    
    >({
         mutationFn:async({form, param})=>{
            const responses = await client.api.workspaces[":workspaceId"]["$patch"]({form, param});

            if (!responses.ok){
               throw new Error("Failed to update workspace")
            };
            return await responses.json();
         },
         onSuccess: ({data})=>{
           toast.success("Workspace updated😎")
           router.refresh();
            queryClient.invalidateQueries({queryKey: ["workspaces"]});
            queryClient.invalidateQueries({queryKey: ["workspaces", data.$id]});
         },
         onError:()=>{
            toast.error("Failed to create workspace")
         }
    });
    return mutation;
}