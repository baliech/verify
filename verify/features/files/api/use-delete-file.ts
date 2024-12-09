import {useMutation} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from "@/lib/rpc";
import { json } from "stream/consumers";
import { toast } from "sonner";
import {useQueryClient} from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.files[":projectId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.files[":projectId"]["$delete"]>;


export const useDeleteFile =()=>{
   const router = useRouter();
   
   const queryClient = useQueryClient();
    const mutation =useMutation<
       ResponseType,
       Error,
       RequestType
    
    >({
         mutationFn:async({param})=>{
            const responses = await client.api.files[":projectId"]["$delete"]({param});

            if (!responses.ok){
               throw new Error("Failed to delete project")
            };
            return await responses.json();
         },
         onSuccess: ({data})=>{
           toast.success("project deleted😎")
           router.refresh();
            queryClient.invalidateQueries({queryKey: ["Table"]});
            queryClient.invalidateQueries({queryKey: ["Table",data.$id]});
         },
         onError:()=>{
            toast.error("Failed to delete  project")
         }
    });
    return mutation;
}