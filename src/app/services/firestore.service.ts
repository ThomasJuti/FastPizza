import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    collection,
    collectionData,
    doc,
    docData,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    setDoc,
    onSnapshot
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Pizza, Ingredient } from '../models/pizza.model';
import { Beverage } from '../models/beverage.model';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
    private firestore = inject(Firestore);

    // ========================
    //        PIZZAS
    // ========================

    getPizzas(): Observable<Pizza[]> {
        const pizzasRef = collection(this.firestore, 'pizzas');
        return new Observable<Pizza[]>(subscriber => {
            const unsubscribe = onSnapshot(pizzasRef, (snapshot) => {
                const pizzas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pizza));
                subscriber.next(pizzas);
            }, (error) => subscriber.error(error));
            return () => unsubscribe();
        });
    }

    async addPizza(pizza: Pizza): Promise<string> {
        const pizzasRef = collection(this.firestore, 'pizzas');
        const docRef = await addDoc(pizzasRef, pizza);
        return docRef.id;
    }

    async updatePizza(id: string, data: Partial<Pizza>): Promise<void> {
        const pizzaDoc = doc(this.firestore, `pizzas/${id}`);
        await updateDoc(pizzaDoc, data);
    }

    async deletePizza(id: string): Promise<void> {
        const pizzaDoc = doc(this.firestore, `pizzas/${id}`);
        await deleteDoc(pizzaDoc);
    }

    // ========================
    //       BEBIDAS
    // ========================

    getBeverages(): Observable<Beverage[]> {
        const beveragesRef = collection(this.firestore, 'beverages');
        return new Observable<Beverage[]>(subscriber => {
            const unsubscribe = onSnapshot(beveragesRef, (snapshot) => {
                const beverages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Beverage));
                subscriber.next(beverages);
            }, (error) => subscriber.error(error));
            return () => unsubscribe();
        });
    }

    async addBeverage(beverage: Beverage): Promise<string> {
        const beveragesRef = collection(this.firestore, 'beverages');
        const docRef = await addDoc(beveragesRef, beverage);
        return docRef.id;
    }

    async updateBeverage(id: string, data: Partial<Beverage>): Promise<void> {
        const beverageDoc = doc(this.firestore, `beverages/${id}`);
        await updateDoc(beverageDoc, data);
    }

    async deleteBeverage(id: string): Promise<void> {
        const beverageDoc = doc(this.firestore, `beverages/${id}`);
        await deleteDoc(beverageDoc);
    }

    // ========================
    //     INGREDIENTES
    // ========================

    getIngredients(): Observable<Ingredient[]> {
        const ingredientsRef = collection(this.firestore, 'ingredients');
        return new Observable<Ingredient[]>(subscriber => {
            const unsubscribe = onSnapshot(ingredientsRef, (snapshot) => {
                const ingredients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ingredient));
                subscriber.next(ingredients);
            }, (error) => subscriber.error(error));
            return () => unsubscribe();
        });
    }

    // ========================
    //       PEDIDOS
    // ========================

    getOrders(): Observable<Order[]> {
        const ordersRef = collection(this.firestore, 'orders');
        const q = query(ordersRef, orderBy('createdAt', 'desc'));
        return new Observable<Order[]>(subscriber => {
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                subscriber.next(orders);
            }, (error) => subscriber.error(error));
            return () => unsubscribe();
        });
    }

    getUserOrders(userId: string): Observable<Order[]> {
        const ordersRef = collection(this.firestore, 'orders');
        const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
        return new Observable<Order[]>(subscriber => {
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                subscriber.next(orders);
            }, (error) => subscriber.error(error));
            return () => unsubscribe();
        });
    }

    async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
        const ordersRef = collection(this.firestore, 'orders');
        const docRef = await addDoc(ordersRef, {
            ...order,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    }

    async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
        const orderDoc = doc(this.firestore, `orders/${orderId}`);
        await updateDoc(orderDoc, {
            status,
            updatedAt: serverTimestamp()
        });
    }

    // ========================
    //     SEED DATA
    // ========================

    async seedMenu(): Promise<void> {
        const pizzas: Omit<Pizza, 'id'>[] = [
            {
                name: 'Margherita',
                description: 'La clásica italiana: salsa de tomate, mozzarella fresca y albahaca',
                image: 'assets/images/margherita.jpg',
                price: 22000,
                category: 'clasica',
                ingredients: ['Salsa de tomate', 'Mozzarella', 'Albahaca'],
                available: true
            },
            {
                name: 'Pepperoni',
                description: 'Abundante pepperoni sobre queso mozzarella derretido',
                image: 'assets/images/pepperoni.jpg',
                price: 25000,
                category: 'clasica',
                ingredients: ['Salsa de tomate', 'Mozzarella', 'Pepperoni'],
                available: true
            },
            {
                name: 'Hawaiana',
                description: 'Jamón y piña con mozzarella — la combinación que divide al mundo',
                image: 'assets/images/hawaiana.jpg',
                price: 26000,
                category: 'clasica',
                ingredients: ['Salsa de tomate', 'Mozzarella', 'Jamón', 'Piña'],
                available: true
            },
            {
                name: 'BBQ Chicken',
                description: 'Pollo a la BBQ, cebolla caramelizada, tocino y mozzarella',
                image: 'assets/images/bbq-chicken.jpg',
                price: 30000,
                category: 'premium',
                ingredients: ['Salsa BBQ', 'Mozzarella', 'Pollo', 'Cebolla', 'Tocino'],
                available: true
            },
            {
                name: 'Cuatro Quesos',
                description: 'Mozzarella, parmesano, gorgonzola y queso de cabra',
                image: 'assets/images/cuatro-quesos.jpg',
                price: 32000,
                category: 'premium',
                ingredients: ['Mozzarella', 'Parmesano', 'Gorgonzola', 'Queso de cabra'],
                available: true
            },
            {
                name: 'Vegetariana Suprema',
                description: 'Pimentón, champiñones, aceitunas, tomate y cebolla',
                image: 'assets/images/vegetariana.jpg',
                price: 24000,
                category: 'vegetariana',
                ingredients: ['Salsa de tomate', 'Mozzarella', 'Pimentón', 'Champiñones', 'Aceitunas', 'Cebolla'],
                available: true
            },
            {
                name: 'Mexicana',
                description: 'Carne molida, jalapeños, frijoles, maíz y salsa picante',
                image: 'assets/images/mexicana.jpg',
                price: 28000,
                category: 'premium',
                ingredients: ['Salsa picante', 'Mozzarella', 'Carne molida', 'Jalapeños', 'Frijoles', 'Maíz'],
                available: true
            },
            {
                name: 'Napolitana',
                description: 'Tomates frescos, ajo, aceite de oliva y orégano',
                image: 'assets/images/napolitana.jpg',
                price: 23000,
                category: 'vegetariana',
                ingredients: ['Salsa de tomate', 'Mozzarella', 'Tomate fresco', 'Ajo', 'Orégano'],
                available: true
            }
        ];

        const beverages: Omit<Beverage, 'id'>[] = [
            { name: 'Coca-Cola', image: 'assets/images/coca-cola.jpg', price: 4000, size: '400ml', category: 'gaseosa', available: true },
            { name: 'Sprite', image: 'assets/images/sprite.jpg', price: 4000, size: '400ml', category: 'gaseosa', available: true },
            { name: 'Jugo de Naranja', image: 'assets/images/jugo-naranja.jpg', price: 5000, size: '350ml', category: 'jugo', available: true },
            { name: 'Agua Mineral', image: 'assets/images/agua.jpg', price: 3000, size: '500ml', category: 'agua', available: true },
            { name: 'Limonada Natural', image: 'assets/images/limonada.jpg', price: 5500, size: '400ml', category: 'jugo', available: true },
            { name: 'Cerveza Artesanal', image: 'assets/images/cerveza.jpg', price: 8000, size: '330ml', category: 'cerveza', available: true },
        ];

        const ingredients: Omit<Ingredient, 'id'>[] = [
            { name: 'Pepperoni', price: 3000, category: 'proteina' },
            { name: 'Jamón', price: 3000, category: 'proteina' },
            { name: 'Pollo', price: 3500, category: 'proteina' },
            { name: 'Carne Molida', price: 3500, category: 'proteina' },
            { name: 'Tocino', price: 3000, category: 'proteina' },
            { name: 'Salchichón', price: 2500, category: 'proteina' },
            { name: 'Champiñones', price: 2000, category: 'vegetal' },
            { name: 'Pimentón', price: 1500, category: 'vegetal' },
            { name: 'Cebolla', price: 1000, category: 'vegetal' },
            { name: 'Aceitunas', price: 2000, category: 'vegetal' },
            { name: 'Tomate Fresco', price: 1500, category: 'vegetal' },
            { name: 'Piña', price: 1500, category: 'vegetal' },
            { name: 'Jalapeños', price: 1500, category: 'vegetal' },
            { name: 'Maíz', price: 1000, category: 'vegetal' },
            { name: 'Mozzarella Extra', price: 3000, category: 'queso' },
            { name: 'Parmesano', price: 3500, category: 'queso' },
            { name: 'Gorgonzola', price: 4000, category: 'queso' },
            { name: 'Queso de Cabra', price: 4000, category: 'queso' },
            { name: 'Salsa de Tomate', price: 0, category: 'salsa' },
            { name: 'Salsa BBQ', price: 1500, category: 'salsa' },
            { name: 'Salsa Picante', price: 1500, category: 'salsa' },
            { name: 'Aceite de Oliva', price: 1000, category: 'salsa' },
        ];

        // Seed pizzas
        for (const pizza of pizzas) {
            await addDoc(collection(this.firestore, 'pizzas'), pizza);
        }

        // Seed beverages
        for (const beverage of beverages) {
            await addDoc(collection(this.firestore, 'beverages'), beverage);
        }

        // Seed ingredients
        for (const ingredient of ingredients) {
            await addDoc(collection(this.firestore, 'ingredients'), ingredient);
        }

        console.log('✅ Menu seeded successfully!');
    }
}
