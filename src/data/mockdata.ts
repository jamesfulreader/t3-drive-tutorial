
export type DriveItem = {
    id: string; // Will be UUID
    name: string;
    type: "folder" | "file";
    url?: string;
    path: string;
    ownerId: string;
};

const USER_ID = "8e8e3a3e-5e3e-4e3e-ae3e-3e3e3e3e3e3e"; // Proper UUID
const generateId = () => crypto.randomUUID(); // Browser API or use 'uuid' package

export const mockDriveData: Record<string, DriveItem[]> = {
    "/": [
        {
            id: generateId(),
            name: "Documents",
            type: "folder",
            path: `/${USER_ID}/Documents/`,
            ownerId: USER_ID
        },
        {
            id: generateId(),
            name: "Photos",
            type: "folder",
            path: `/${USER_ID}/Photos/`,
            ownerId: USER_ID
        },
        {
            id: generateId(),
            name: "Project Proposal.pdf",
            type: "file",
            url: "https://example.com/project.pdf",
            path: `/${USER_ID}/Project Proposal.pdf`,
            ownerId: USER_ID
        },
    ],
    [`/${USER_ID}/Documents/`]: [
        {
            id: generateId(),
            name: "Report Q1.pdf",
            type: "file",
            url: "https://example.com/report.pdf",
            path: `/${USER_ID}/Documents/Report Q1.pdf`,
            ownerId: USER_ID
        },
    ],
    [`/${USER_ID}/Photos/`]: [
        {
            id: generateId(),
            name: "Vacation 2024",
            type: "folder",
            path: `/${USER_ID}/Photos/Vacation 2024/`,
            ownerId: USER_ID
        },
    ],
    [`/${USER_ID}/Photos/Vacation 2024/`]: [
        {
            id: generateId(),
            name: "beach.jpg",
            type: "file",
            url: "https://example.com/beach.jpg",
            path: `/${USER_ID}/Photos/Vacation 2024/beach.jpg`,
            ownerId: USER_ID
        },
    ],
};

// Helper function (unchanged)
export function getDriveItems(path: string): DriveItem[] {
    return mockDriveData[path] ?? [];
}
