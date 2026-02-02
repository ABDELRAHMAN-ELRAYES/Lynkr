/**
 * Validate time format (HH:mm)
 */
export function validateTimeFormat(time: string): boolean {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time);
}

/**
 * Validate day of week (0-6)
 */
export function validateDayOfWeek(day: number): boolean {
    return Number.isInteger(day) && day >= 0 && day <= 6;
}

/**
 * Compare times to ensure start is before end
 */
export function isStartBeforeEnd(startTime: string, endTime: string): boolean {
    return startTime < endTime;
}