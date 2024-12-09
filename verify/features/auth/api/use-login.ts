import {useMutation} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from "@/lib/rpc";
import { json } from "stream/consumers";
import { useRouter } from "next/navigation";
import {useQueryClient} from "@tanstack/react-query";
import { toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.auth.login["$post"]>;
type RequestType = InferRequestType<typeof client.api.auth.login["$post"]>;



export const useLogin =()=>{
   const router = useRouter();
   const queryClient = useQueryClient();
    const mutation =useMutation<
       ResponseType,
       Error,
       RequestType
    
    >({
         mutationFn:async({json})=>{
            const responses = await client.api.auth.login["$post"]({json});
            if (!responses.ok){
               throw new Error("Failed to login")
            };
            
            return await responses.json();
         },
         onSuccess: ()=>{
            toast.success("Logged in")
            router.refresh();
            queryClient.invalidateQueries({queryKey: ["current"]});
         },
         onError:()=>{
            toast.error("Failed to log in");
         },
    });
    return mutation;
}