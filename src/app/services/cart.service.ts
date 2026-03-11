import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/order.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
    private items = new BehaviorSubject<CartItem[]>([]);
    items$ = this.items.asObservable();

    get currentItems(): CartItem[] {
        return this.items.getValue();
    }

    get itemCount(): number {
        return this.currentItems.reduce((sum, item) => sum + item.quantity, 0);
    }

    get subtotal(): number {
        return this.currentItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    get deliveryFee(): number {
        return environment.deliveryFee;
    }

    get total(): number {
        return this.subtotal + this.deliveryFee;
    }

    addItem(item: Omit<CartItem, 'id' | 'quantity'>): void {
        const currentItems = this.currentItems;
        const existingIndex = currentItems.findIndex(i => i.name === item.name && i.type === item.type);

        if (existingIndex >= 0) {
            // Item already exists, increase quantity
            currentItems[existingIndex].quantity += 1;
            this.items.next([...currentItems]);
        } else {
            // New item
            const newItem: CartItem = {
                ...item,
                id: this.generateId(),
                quantity: 1
            };
            this.items.next([...currentItems, newItem]);
        }
    }

    removeItem(itemId: string): void {
        const filtered = this.currentItems.filter(i => i.id !== itemId);
        this.items.next(filtered);
    }

    updateQuantity(itemId: string, quantity: number): void {
        if (quantity <= 0) {
            this.removeItem(itemId);
            return;
        }
        const currentItems = this.currentItems.map(item =>
            item.id === itemId ? { ...item, quantity } : item
        );
        this.items.next(currentItems);
    }

    clearCart(): void {
        this.items.next([]);
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 11);
    }
}
