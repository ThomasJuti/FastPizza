export interface Pizza {
    id?: string;
    name: string;
    description: string;
    image: string;
    price: number;
    category: 'clasica' | 'premium' | 'vegetariana';
    ingredients: string[];
    available: boolean;
}

export interface Ingredient {
    id?: string;
    name: string;
    price: number;
    category: 'proteina' | 'vegetal' | 'queso' | 'salsa';
    image?: string;
}

export interface CustomPizza {
    name: string;
    size: 'personal' | 'mediana' | 'grande' | 'familiar';
    ingredients: Ingredient[];
    basePrice: number;
    totalPrice: number;
}
