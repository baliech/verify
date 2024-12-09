import { Models } from "node-appwrite";


export type Analyze= Models.Document & {

    name:string;
    imageUrl: string;
    userId: string;
    workspaceId: string;
}

