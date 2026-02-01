export interface ICreateAvailabilityData {
    dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
    startTime: string; // HH:mm format
    endTime: string;   // HH:mm format
    timezone?: string;
}

export interface IUpdateAvailabilityData {
    startTime?: string;
    endTime?: string;
    timezone?: string;
}

export interface ISaveAvailabilityPayload {
    availabilities: ICreateAvailabilityData[];
}
