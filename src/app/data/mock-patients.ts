import { Patient } from '../models/patient';

export const mockPatients: Patient[] = [
    {
        id: 'P001',
        name: 'Phoebe Lo',
        latitude: 41.8240,
        longitude: -71.4128,
        lastUpdated: "2025-11-05T14:30:00Z",
        status: 'active',
    },
    {
        id: 'P002',
        name: 'Selena Lo',
        latitude: 25.0330,
        longitude: 121.5654,
        lastUpdated: "2025-11-12T08:15:00Z",
        status: 'active',
    },
    {
        id: 'P003',
        name: 'Khine Zin',
        latitude: 42.3868,
        longitude: -72.5301,
        lastUpdated: "2025-11-18T16:45:00Z",
        status: 'inactive',
    },
    {
        id: 'P004',
        name: 'Susan Hanthu',
        latitude: 42.2793,
        longitude: -71.4162,
        lastUpdated: "2025-11-22T10:20:00Z",
        status: 'active',
    },
    {
        id: 'P005',
        name: 'Emily Chang',
        latitude: 43.5448,
        longitude: -80.2482,
        lastUpdated: "2025-11-28T13:55:00Z",
        status: 'pending',
    }
]