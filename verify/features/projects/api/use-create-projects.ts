import {useMutation} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from "@/lib/rpc";
import { json } from "stream/consumers";
import { toast } from "sonner";
import {useQueryClient} from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.projects["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.projects["$post"]>;



export const useCreateProject =()=>{
   
   const queryClient = useQueryClient();
    const mutation =useMutation<
       ResponseType,
       Error,
       RequestType
    
    >({
         mutationFn:async({form})=>{
            const responses = await client.api.projects["$post"]({form});

            if (!responses.ok){
               throw new Error("Failed to create project")
            };
            return await responses.json();
         },
         onSuccess: ()=>{
           toast.success("project created😎")
            queryClient.invalidateQueries({queryKey: ["projects"]});
         },
         onError:()=>{
            toast("🥴Failed to create project already have a project created")
         }
    });
    return mutation;
}