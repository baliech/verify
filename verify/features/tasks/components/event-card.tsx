import { cn } from "@/lib/utils"

interface EventCardProps {
    
    id:string
}



export const EventCard=({id}:EventCardProps)=>{
return (
    <div className="px-2">
        <div className={cn(
            "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition"
        )}>
               <p>{id}</p>
        </div>

    </div>
)
}