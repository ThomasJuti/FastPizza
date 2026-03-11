export interface Beverage {
    id?: string;
    name: string;
    image: string;
    price: number;
    size: string;
    category: 'gaseosa' | 'jugo' | 'agua' | 'cerveza';
    available: boolean;
}
