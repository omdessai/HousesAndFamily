export interface Person {
    id: string;
    name: string;
    birthDate?: Date | null;
    avatarUri?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
