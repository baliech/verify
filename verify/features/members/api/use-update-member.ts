import {useMutation} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from "@/lib/rpc";
import { json } from "stream/consumers";
import { toast } from "sonner";
import {useQueryClient} from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.members[":memberId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.members[":memberId"]["$patch"]>;



export const useUpdateMember =()=>{
   
   const queryClient = useQueryClient();
    const mutation =useMutation<
       ResponseType,
       Error,
       RequestType
    
    >({
         mutationFn:async({param, json})=>{
            const responses = await client.api.members[":memberId"]["$patch"]({param, json});

            if (!responses.ok){
               throw new Error("Failed to update member")
            };
            return await responses.json();
         },
         onSuccess: ()=>{
           toast.success("Member updated😎")
            queryClient.invalidateQueries({queryKey: ["members"]});
            
         },
         onError:()=>{
            toast.error("Failed to update member")
         }
    });
    return mutation;
}