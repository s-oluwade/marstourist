export interface ProductWithId {
    _id: string;
    title: string,
    brand: string,
    category: string,
    description: string,
    discountPercentage: number,
    images: string[],
    price: number,
    stock: number,
    thumbnail: string,
    rating: number,
}

export interface Product {
    title: string,
    brand: string,
    category: string,
    description: string,
    discountPercentage: number,
    images: string[],
    price: number,
    stock: number,
    thumbnail: string,
    rating: number,
}