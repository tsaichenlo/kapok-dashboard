export interface Patient {
    id: string,
    name: string,
    latitude: number,
    longitude: number,
    lastUpdated: string, // ISO string format, e.g. "2025-11-05T14:30:00Z"
    status: string,
}
