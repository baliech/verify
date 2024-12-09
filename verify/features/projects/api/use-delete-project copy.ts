import {useMutation} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from "@/lib/rpc";
import { json } from "stream/consumers";
import { toast } from "sonner";
import {useQueryClient} from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.projects[":projectId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.projects[":projectId"]["$delete"]>;



export const useDeleteProject =()=>{
   const router = useRouter();
   
   const queryClient = useQueryClient();
    const mutation =useMutation<
       ResponseType,
       Error,
       RequestType
    
    >({
         mutationFn:async({param})=>{
            const responses = await client.api.projects[":projectId"]["$delete"]({param});

            if (!responses.ok){
               throw new Error("Failed to delete project")
            };
            return await responses.json();
         },
         onSuccess: ({data})=>{
           toast.success("project deleted😎")
           router.refresh();
            queryClient.invalidateQueries({queryKey: ["projects"]});
            queryClient.invalidateQueries({queryKey: ["projects",data.$id]});
         },
         onError:()=>{
            toast.error("Failed to delete  project")
         }
    });
    return mutation;
}