import Image from "next/image";
import {cn} from "@/lib/utils";
import {Avatar, AvatarFallback} from "@/components/ui/avatar"




interface WorkSpaceAvatarProps {

    image?: string;
    name: string;
    className?: string;

}



export const WorkSpaceAvatar =({
    image,
    name,
    className
}: WorkSpaceAvatarProps) =>{
     if(image){
        return(
            <div className={cn(
                "size-10 relative rounded-md  overflow-hidden",
                className,
            )}>
                <Image src={image} alt={name} fill className="object-cover"/>
            </div>
        )
     }
     return(
        <Avatar className={cn("size-10 ", className)}>
            <AvatarFallback className="text-white bg-blue-600 font-semibold text-lg uppercase ">
                {name[0]}
            </AvatarFallback>
        </Avatar>
     )

}