import {useMutation} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from "@/lib/rpc";
import { json } from "stream/consumers";
import { toast } from "sonner";
import {useQueryClient} from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.members[":memberId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.members[":memberId"]["$delete"]>;



export const useDeleteMember =()=>{
   
   const queryClient = useQueryClient();
    const mutation =useMutation<
       ResponseType,
       Error,
       RequestType
    
    >({
         mutationFn:async({param})=>{
            const responses = await client.api.members[":memberId"]["$delete"]({param});

            if (!responses.ok){
               throw new Error("Failed to delete member")
            };
            return await responses.json();
         },
         onSuccess: ()=>{
           toast.success("Member deleted😎")
            queryClient.invalidateQueries({queryKey: ["members"]});
            
         },
         onError:()=>{
            toast.error("Failed to delete member")
         }
    });
    return mutation;
}