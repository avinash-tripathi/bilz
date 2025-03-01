import { DateInput } from "@fullcalendar/core";

// Event Data
export interface Event {
    name: string;
    value: string;
}

export class clsEventInput{
    id:string;
    title:string;
    start:DateInput;
    end:DateInput;
}
