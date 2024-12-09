import { DATABASE_ID, IMAGES_BUCKET_ID, ANALYZE_ID, WORKSPACE_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { error } from "console";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import {z} from "zod"
import { createProjectSchema, updateProjectSchema } from "../schema";
import { Analyze } from "../types";
import { MemberRole } from "@/features/members/types";
const app =new Hono()


.get (
    "/",
    sessionMiddleware,
    zValidator("query", z.object({workspaceId: z.string()})),
    async (c)=>{
         const user= c.get("user");
         const databases = c.get("databases");
         const {workspaceId} = c.req.valid("query");
         if(!workspaceId){
            return c.json({error:"Missing workspaceId"}, 400)
         }

         const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id,

         });
         if(!member){
            return c.json({error:"Unauthorized"}, 400);
                 }

                 const workspace = await databases.getDocument(
                  DATABASE_ID,
                  WORKSPACE_ID, // Replace with your actual collection ID for workspaces
                  workspaceId
              );
              const queryConditions = [
               Query.equal("workspaceId", workspaceId),
               Query.orderDesc("$createdAt")
           ];
   
           if (workspace.userId !== user.$id) {
               queryConditions.push(Query.equal("userId", user.$id));
           }
      

                 const projects = await databases.listDocuments(
                    DATABASE_ID,
                    ANALYZE_ID,
                    queryConditions,
                 );
                 return c.json({data: projects});
    }
)
.patch(
   "/:projectId",
   sessionMiddleware,
   zValidator("form", updateProjectSchema),
   async (c)=>{
      const databases = c.get("databases");
      const storage =c.get("storage");
      const user = c.get("user");

      const {projectId}= c.req.param();
      const {name, image} =c.req.valid("form");
      const existingProject = await databases.getDocument<Analyze>(
         DATABASE_ID,
         ANALYZE_ID,
         projectId,
      )

      const member =await getMember({
         databases,
         workspaceId: existingProject.workspaceId,
          userId: user.$id,
      });

      if(!member){
         return c.json({error: "Unauthorized"},401);
      }
      let uploadedImageUrl: string |undefined;
      if (image instanceof File){
         const file = await storage.createFile(
            IMAGES_BUCKET_ID,
            ID.unique(),
            image,
         );
            
         const arrayBuffer = await storage.getFilePreview(
            IMAGES_BUCKET_ID,
            file.$id,
            
         );
         uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`
      } else {
         uploadedImageUrl= image;
      }
      const project = await databases.updateDocument(
         DATABASE_ID,
         ANALYZE_ID,
         projectId,
         {
            name,
            imageUrl:uploadedImageUrl
         }
      );
      return c.json({data:project})
   }
)
.delete(
   "/:projectId",
   sessionMiddleware,
   async (c)=>{
      const databases = c.get("databases");
      const user = c.get ("user");
      const {projectId} = c.req.param();
      const existingProject = await databases.getDocument<Analyze>(
         DATABASE_ID,
         ANALYZE_ID,
         projectId,
      )

      const member = await getMember({

           databases,
           workspaceId: existingProject.workspaceId,
           userId: user.$id,
      });
      if(!member){
         return c.json({error:"Unauthorized"}, 401);
      }
      await databases.deleteDocument(
         DATABASE_ID,
         ANALYZE_ID,
         projectId,
      );
      return c.json({data:{$id:existingProject.$id}});
   }
)
export default app;