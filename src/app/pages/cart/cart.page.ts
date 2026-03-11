import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonBackButton, IonButton, IonIcon, IonItemSliding,
    IonItem, IonItemOptions, IonItemOption, IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, addOutline, removeOutline, cartOutline, arrowForwardOutline } from 'ionicons/icons';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/order.model';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [
        CommonModule,
        IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
        IonBackButton, IonButton, IonIcon, IonItemSliding,
        IonItem, IonItemOptions, IonItemOption, IonLabel
    ],
    templateUrl: './cart.page.html',
    styleUrls: ['./cart.page.scss']
})
export class CartPage {
    cartService = inject(CartService);
    private router = inject(Router);

    constructor() {
        addIcons({ trashOutline, addOutline, removeOutline, cartOutline, arrowForwardOutline });
    }

    increaseQuantity(item: CartItem): void {
        this.cartService.updateQuantity(item.id, item.quantity + 1);
    }

    decreaseQuantity(item: CartItem): void {
        this.cartService.updateQuantity(item.id, item.quantity - 1);
    }

    removeItem(itemId: string): void {
        this.cartService.removeItem(itemId);
    }

    goToMenu(): void {
        this.router.navigate(['/tabs/menu']);
    }

    goToCheckout(): void {
        this.router.navigate(['/tabs/checkout']);
    }
}
