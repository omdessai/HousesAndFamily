export type ChoreFrequency = 'Once' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
export type ChorePriority = 'Low' | 'Medium' | 'High';
export type ChoreStatus = 'Pending' | 'Completed';

export interface Chore {
    id: string;
    houseId?: string; // Optional: null if general chore
    assignedToId?: string; // Optional: link to Person
    title: string;
    description?: string;
    dueDate: string; // ISO Date
    frequency: ChoreFrequency;
    priority: ChorePriority;
    status: ChoreStatus;
}
