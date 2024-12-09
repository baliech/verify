import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID, TABLE_ID, WORKSPACE_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { error } from "console";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import {z} from "zod"
import { createFileSchema, updateFileSchema } from "../schema";
import { Files } from "../types";
import { MemberRole } from "@/features/members/types";
import crypto from "crypto";
import { createProjectSchema } from "@/features/projects/schema";


const app =new Hono()
.post(
   "/",
   sessionMiddleware,
   zValidator("form", createFileSchema),
   async (c) => {
     const databases = c.get("databases");
     const user = c.get("user");
     const storage = c.get("storage");
     
     const { name, image, workspaceId } = c.req.valid("form");
     
     // Check if the user is a member of the workspace
     const member = await getMember({
       databases,
       workspaceId,
       userId: user.$id,
     });
 
     if (!member) {
       return c.json({ error: "Unauthorized" }, 401);
     }
 
     let uploadedImageUrl: string | undefined;
     let imageHash: string | undefined;
 
     // If the image is a valid file, process it
     if (image instanceof File) {
       // Generate SHA-256 hash for the image
       const imageBuffer = await image.arrayBuffer();
       imageHash = crypto
         .createHash("sha256")
         .update(Buffer.from(imageBuffer))
         .digest("hex");
 
       // Check if the image hash already exists in the database using a query
       const queryConditions = [
         Query.equal("hash", imageHash), // Check for duplicate hash
         Query.equal("workspaceId", workspaceId), // Ensure it's within the same workspace
       ];
 
       const existingImages = await databases.listDocuments(
         DATABASE_ID,
         TABLE_ID,
         queryConditions
       );
 
       // If an image with the same hash exists, return an error
       if (existingImages.total > 0) {
         return c.json({ error: "Image already exists" }, 409);
       }
 
       // Upload the image to Appwrite if no duplicates were found
       const file = await storage.createFile(
         IMAGES_BUCKET_ID,
         ID.unique(),
         image
       );
 
       // Construct the URL for the uploaded image
       uploadedImageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${IMAGES_BUCKET_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
     }
 
     // Save the image details along with the hash to the database
     const project = await databases.createDocument(
       DATABASE_ID,
       TABLE_ID,
       ID.unique(),
       {
         imageUrl: uploadedImageUrl,
         hash: imageHash, // Save the hash for future duplicate checks
         workspaceId,
         name,
         userId: user.$id,
         timeAdded: new Date().toISOString(),
         
       }
     );
 
     return c.json({ data: project });
   }
 )
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
                  workspaceId,
                  

              );
              
              const queryConditions = [
               Query.equal("workspaceId", workspaceId),
               Query.orderDesc("$createdAt")
           ];
   
           if (workspace.userId !== user.$id) {
               queryConditions.push(Query.equal("userId", user.$id));
           }
      

                 const table = await databases.listDocuments<Files>(
                    DATABASE_ID,
                    TABLE_ID,
                    queryConditions,
                 );
                 console.log(user.$id)
                 return c.json({data: table});
    }
)
.patch(
   "/:projectId",
   sessionMiddleware,
   zValidator("form", updateFileSchema),
   async (c)=>{
      const databases = c.get("databases");
      const storage =c.get("storage");
      const user = c.get("user");

      const {projectId}= c.req.param();
      const {name, image} =c.req.valid("form");
      const existingProject = await databases.getDocument<Files>(
         DATABASE_ID,
         TABLE_ID,
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
         TABLE_ID,
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
      const existingProject = await databases.getDocument<Files>(
         DATABASE_ID,
         TABLE_ID,
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
         TABLE_ID,
         projectId,
      );
      return c.json({data:{$id:existingProject.$id}});
   }
)
export default app;