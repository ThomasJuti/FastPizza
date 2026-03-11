import { Ingredient } from './pizza.model';

export interface CartItem {
    id: string;
    type: 'pizza' | 'custom-pizza' | 'beverage';
    name: string;
    description?: string;
    image?: string;
    price: number;
    quantity: number;
    ingredients?: Ingredient[]; // only for custom pizzas
    size?: string;
}

export interface Order {
    id?: string;
    userId: string;
    userEmail: string;
    userName: string;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    address: string;
    phone: string;
    lat?: number;
    lng?: number;
    status: 'pendiente' | 'confirmado' | 'preparando' | 'enviado' | 'entregado' | 'cancelado';
    paypalTransactionId?: string;
    createdAt: any; // Firestore Timestamp
    updatedAt?: any;
    notes?: string;
}
