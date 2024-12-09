import {useMutation} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from "@/lib/rpc";
import { json } from "stream/consumers";
import { toast } from "sonner";
import {useQueryClient} from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.files["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.files["$post"]>;



export const useCreateFile =()=>{
   
   const queryClient = useQueryClient();
    const mutation =useMutation<
       ResponseType,
       Error,
       RequestType
    
    >({
         mutationFn:async({form})=>{
            const responses = await client.api.files["$post"]({form});

            if (!responses.ok){
               throw new Error("🥴Failed to upload")
            };
            return await responses.json();
         },
         onSuccess: ()=>{
           toast.success("file uploaded😎")
            queryClient.invalidateQueries({queryKey: ["projects"]});
         },
         onError:()=>{
            toast("🥴Failed to upload:file already exist or incorrect file format")
         }
    });
    return mutation;
}