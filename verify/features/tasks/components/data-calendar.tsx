import "react-big-calendar/lib/css/react-big-calendar.css"
import "./data-calender.css";
import { Files } from "@/features/files/types"
import { format, getDay, parse, startOfWeek, addMonths, subMonths, isValid } from "date-fns"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { enUS } from "date-fns/locale"
import { useState } from "react"
import { EventCard } from "./event-card";

const locales = {
    "en-US": enUS
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

interface DataCalendarProps {
    data: Files[];
}

const isValidDate = (dateString: string | number | Date): boolean => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return isValid(date);
};

export const DataCalender = ({
    data,
}: DataCalendarProps) => {
    // Safely initialize the default date
    const getInitialDate = () => {
        if (data.length > 0 && isValidDate(data[0].timeAdded)) {
            return new Date(data[0].timeAdded);
        }
        return new Date();
    };

    const [value, setValue] = useState(getInitialDate());

    // Filter out invalid dates and map to events
    const events = data
        .filter(table => isValidDate(table.timeAdded))
        .map((table) => {
            const date = new Date(table.timeAdded);
            console.log('Processing date:', {
                original: table.timeAdded,
                parsed: date,
                isValid: isValid(date)
            });
            return {
                start: date,
                end: date,
                title: table.name
            };
        });

    const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
        if (action === "PREV") {
            setValue(subMonths(value, 1));
        } else if (action === "NEXT") {
            setValue(addMonths(value, 1));
        } else if (action === "TODAY") {
            setValue(new Date());
        }
    };

    return (
        <div>
            <Calendar
                localizer={localizer}
                date={value}
                events={events}
                views={["month"]}
                toolbar={true}
                showAllEvents={true}
                className="h-full"
                max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                formats={{
                    weekdayFormat: (date, culture, localizer) => 
                        localizer?.format(date, "EEE", culture) ?? ""
                }}
                components= {{
                    eventWrapper:({event})=>(
                        <EventCard
                        id={event.title}/>
                    )
                }}
                
            />
        </div>
    );
};