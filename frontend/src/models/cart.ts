export interface Cart {
    _id: string;
    owner: string;
    products: { [key: string]: { count: number, timestamp: number } };
    createdAt: Date;
    updatedAt: Date;
}