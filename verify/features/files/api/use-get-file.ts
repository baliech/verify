
import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetProjectsProps{
    workspaceId: string;

};


export const useGetFiles =({workspaceId,}:useGetProjectsProps)=>{

    const query =useQuery({
        queryKey:["Table", workspaceId],
        queryFn: async ()=>{
            const response = await client.api.files.$get(
                {query:{workspaceId},}
            );

            if(!response.ok){
                 throw new Error("Failed to fetch projects");
            }
            const {data} = await response.json();
            return data;
        },
    });

    return query;
}