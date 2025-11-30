import type { House } from '../types/house';
import type { Person } from '../types/person';
import type { InventoryItem } from '../types/inventory';
import type { Chore } from '../types/chore';

// Mock Data
const houses: House[] = [
    {
        id: '1',
        name: 'My Sweet Home',
        address: '123 Maple Street, Springfield',
        interest: 'Own',
        residenceType: 'Primary',
        isFavorite: true,
    },
    {
        id: '2',
        name: 'Vacation House',
        address: '456 Beach Blvd, Miami',
        interest: 'Own',
        residenceType: 'Vacation',
        isFavorite: false,
    },
];

const people: Person[] = [
    {
        id: '1',
        name: 'John Doe',
    },
    {
        id: '2',
        name: 'Jane Doe',
    },
];

const inventory: InventoryItem[] = [
    {
        id: '1',
        houseId: '1',
        name: 'Refrigerator',
        category: 'Appliance',
        brand: 'LG',
        modelNumber: 'LFXS26973S',
    },
    {
        id: '2',
        houseId: '1',
        name: 'Water Heater',
        category: 'Plumbing',
        brand: 'Rheem',
        purchaseDate: '2023-01-15',
    },
    {
        id: '3',
        houseId: '2',
        name: 'AC Unit',
        category: 'Appliance',
        brand: 'Carrier',
    },
];

const chores: Chore[] = [
    {
        id: '1',
        houseId: '1',
        title: 'Mow the Lawn',
        dueDate: '2023-11-30',
        frequency: 'Weekly',
        priority: 'Medium',
        status: 'Pending',
        assignedToId: '1',
    },
    {
        id: '2',
        houseId: '1',
        title: 'Change Air Filters',
        dueDate: '2023-12-01',
        frequency: 'Monthly',
        priority: 'High',
        status: 'Pending',
    },
    {
        id: '3',
        houseId: '2',
        title: 'Check Security System',
        dueDate: '2023-12-15',
        frequency: 'Monthly',
        priority: 'Medium',
        status: 'Pending',
    },
];

// API Simulation
export const mockStore = {
    getHouses: () => Promise.resolve([...houses]),
    addHouse: (house: House) => {
        houses.push(house);
        return Promise.resolve(house);
    },
    updateHouse: (id: string, updates: Partial<House>) => {
        const index = houses.findIndex(h => h.id === id);
        if (index !== -1) {
            houses[index] = { ...houses[index], ...updates };
            return Promise.resolve(houses[index]);
        }
        return Promise.reject(new Error('House not found'));
    },
    deleteHouse: (id: string) => {
        const index = houses.findIndex(h => h.id === id);
        if (index !== -1) {
            houses.splice(index, 1);
        }
        return Promise.resolve();
    },

    getPeople: () => Promise.resolve([...people]),
    addPerson: (person: Person) => {
        people.push(person);
        return Promise.resolve(person);
    },
    updatePerson: (id: string, updates: Partial<Person>) => {
        const index = people.findIndex(p => p.id === id);
        if (index !== -1) {
            people[index] = { ...people[index], ...updates };
            return Promise.resolve(people[index]);
        }
        return Promise.reject(new Error('Person not found'));
    },

    addInventoryItem: (item: InventoryItem) => {
        inventory.push(item);
        return Promise.resolve(item);
    },
    updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => {
        const index = inventory.findIndex(i => i.id === id);
        if (index !== -1) {
            inventory[index] = { ...inventory[index], ...updates };
            return Promise.resolve(inventory[index]);
        }
        return Promise.reject(new Error('Item not found'));
    },

    getHouseInventory: (houseId: string) =>
        Promise.resolve(inventory.filter(item => item.houseId === houseId)),

    getHouseChores: (houseId: string) =>
        Promise.resolve(chores.filter(chore => chore.houseId === houseId)),

    getAllChores: () => Promise.resolve([...chores]),
    addChore: (chore: Chore) => {
        chores.push(chore);
        return Promise.resolve(chore);
    },
    updateChore: (id: string, updates: Partial<Chore>) => {
        const index = chores.findIndex(c => c.id === id);
        if (index !== -1) {
            chores[index] = { ...chores[index], ...updates };
            return Promise.resolve(chores[index]);
        }
        return Promise.reject(new Error('Chore not found'));
    },
};
