import { Models } from "node-appwrite";


export type Files = Models.Document & {

    name:string;
    imageUrl: string;
    userId: string;
    hash:string;
    workspaceId: string;
    timeAdded:string;
    date:string;
    signature:string;
    kudraResults?: {
        extracted_text?: string;
        responses?: Array<{
            question: string;
            answer: string;
            status: string;
        }>;
    };
    
}

