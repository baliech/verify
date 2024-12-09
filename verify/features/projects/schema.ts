import {z} from "zod";



export const createProjectSchema = z.object({
    name:z.string().trim().min(1,"Minimum 1 character Required").optional(),
    image:z.union([

        z.instanceof(File),
        z.string().transform((value)=> value === ""?undefined: value),

    ])
    .optional(),
    workspaceId:z.string(),
    signature:z.string().trim().min(1,"Minimum 1 character Required").optional(),
    
})

export const updateProjectSchema = z.object({
    name:z.string().trim().min(1,"Minimum 1 character Required").optional(),
    image:z.union([

        z.instanceof(File),
        z.string().transform((value)=> value === ""?undefined: value),

    ])
    .optional(),

})