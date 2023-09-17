export interface Purchase {
    _id: string;
    userId: string;
    productId: string;
    title: string;
    imageUrl: string;
    brand: string;
    category: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
}