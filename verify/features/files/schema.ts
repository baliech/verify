import {z} from "zod";



export const createFileSchema = z.object({
    name:z.string().trim().min(1,"Minimum 1 character Required").optional(),
    signature:z.string().trim().min(1,"Minimum 1 character Required").optional(),
    hash:z.string().trim().min(1,"Minimum 1 character Required").optional(),
    timeAdded:z.string().trim().min(1,"Minimum 1 character Required").optional(),
    date:z.string().trim().min(1,"Minimum 1 character Required").optional(),
    image:z.union([

        z.instanceof(File),
        z.string().transform((value)=> value === ""?undefined: value),

    ])
    .optional(),
    workspaceId:z.string(),

})

export const updateFileSchema = z.object({
    name:z.string().trim().min(1,"Minimum 1 character Required").optional(),
    image:z.union([

        z.instanceof(File),
        z.string().transform((value)=> value === ""?undefined: value),

    ])
    .optional(),
    workspaceId:z.string().optional(),

})