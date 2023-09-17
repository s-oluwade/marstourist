export interface Cart {
    _id: string;
    userId: string;
    products: { [key: string]: { count: number, timestamp: number } };
    createdAt: Date;
    updatedAt: Date;
}