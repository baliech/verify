import {useMutation} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from "@/lib/rpc";
import { json } from "stream/consumers";
import { toast } from "sonner";
import {useQueryClient} from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.projects[":projectId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.projects[":projectId"]["$patch"]>;



export const useUpdateFile =()=>{
   const router = useRouter();
   
   const queryClient = useQueryClient();
    const mutation =useMutation<
       ResponseType,
       Error,
       RequestType
    
    >({
         mutationFn:async({form, param})=>{
            const responses = await client.api.projects[":projectId"]["$patch"]({form, param});

            if (!responses.ok){
               throw new Error("Failed to update project")
            };
            return await responses.json();
         },
         onSuccess: ({data})=>{
           toast.success("project updated😎")
           router.refresh();
            queryClient.invalidateQueries({queryKey: ["projects"]});
            queryClient.invalidateQueries({queryKey: ["project",data.$id]});
         },
         onError:()=>{
            toast.error("Failed to update  project")
         }
    });
    return mutation;
}