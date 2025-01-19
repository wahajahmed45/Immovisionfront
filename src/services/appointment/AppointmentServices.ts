import config from '@/utils/config';

// Récupérer les RDV d'un client
export const getClientAppointments = async (clientEmail: string) => {
    try {
        const response = await fetch(`${config.apiBaseUrl}/appointments/client/${clientEmail}`);
        if (!response.ok) throw new Error('Failed to fetch client appointments');
        return await response.json();
    } catch (error) {
        console.error('Error fetching client appointments:', error);
        throw error;
    }
};

// Récupérer les RDV d'un agent
export const getAgentAppointments = async (agentEmail: string) => {
    try {
        const response = await fetch(`${config.apiBaseUrl}/appointments/agent/${agentEmail}`);
        if (!response.ok) throw new Error('Failed to fetch agent appointments');
        return await response.json();
    } catch (error) {
        console.error('Error fetching agent appointments:', error);
        throw error;
    }
};

// Créer un nouveau RDV
export const createAppointment = async (appointmentData: any) => {
    const response = await fetch(`${config.apiBaseUrl}/appointments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
    });
    
    if (!response.ok) {
        if (response.status === 409) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        throw new Error('Failed to create appointment');
    }
    
    return true;
};

// Mettre à jour le statut d'un RDV
export const updateAppointmentStatus = async (id: string, status: string, comment?: string) => {
    try {
        const url = new URL(`${config.apiBaseUrl}/appointments/${id}/status`);
        url.searchParams.append('status', status);
        if (comment) url.searchParams.append('comment', comment);

        const response = await fetch(url.toString(), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) throw new Error('Failed to update appointment status');
        return await response.json();
    } catch (error) {
        console.error('Error updating appointment status:', error);
        throw error;
    }
};

export const getPropertyAppointments = async (propertyId: string) => {
    try {
        const response = await fetch(`${config.apiBaseUrl}/appointments/property/${propertyId}`);
        if (!response.ok) throw new Error('Failed to fetch property appointments');
        return await response.json();
    } catch (error) {
        console.error('Error fetching property appointments:', error);
        throw error;
    }
};
