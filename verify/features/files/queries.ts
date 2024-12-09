import { createSessionClient } from "@/lib/appwrite";
import { getMember } from "../members/utils";
import { DATABASE_ID, TABLE_ID } from "@/config";
import { Files } from "./types";







interface GetFileProps{
    projectId: string;
};




export const getFile= async ({projectId}:GetFileProps )=>{
    
     
    const {databases, account} = await createSessionClient();
    const user = await  account.get();
    const project = await databases.getDocument<Files>(
    
        DATABASE_ID,
        TABLE_ID,
        projectId,
     );
    
    const member = await getMember(
        {
            databases,
            userId: user.$id,
            workspaceId: project.workspaceId,
        }

    );

    if (!member){
        throw new Error("Unauthorized");
    }
   
    
    
     return project;
    
    };