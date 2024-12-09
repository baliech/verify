import {useMutation, useQueryClient} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from "@/lib/rpc";
import { json } from "stream/consumers";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


type ResponseType = InferResponseType<typeof client.api.auth.logout["$post"]>;




export const useLogout =()=>{
   const router = useRouter();
   const queryClient = useQueryClient();

    const mutation =useMutation<
       ResponseType,
       Error
    
    >({
         mutationFn:async()=>{
            const responses = await client.api.auth.logout["$post"]();
            if (!responses.ok){
               throw new Error("Failed to logout")
            };
           
            return await responses.json();
         },
         onSuccess:()=>{
            toast.success("Logged out");
            router.refresh();
            queryClient.invalidateQueries({queryKey: ["current"]});
            queryClient.invalidateQueries({queryKey:["workspaces"]});

            
         },
         onError:()=>{
            toast.error("Failed to logout")
         },
    });
    return mutation;
}