export interface AppointmentDTO {
    id: string;
    dateTime: number[];
    property: {
        id: string;
        title: string;
        image?: string;
        location: string;
    };
    agent: {
        email: string;
        name: string;
    };
    clientEmail: string;
    clientName: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    comment?: string;
    createdAt: string;
}