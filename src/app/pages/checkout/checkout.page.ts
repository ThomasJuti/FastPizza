import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonBackButton, IonIcon, IonSpinner, IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline, callOutline, chatboxOutline, checkmarkCircle } from 'ionicons/icons';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { environment } from '../../../environments/environment';

declare var paypal: any;

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
        IonBackButton, IonIcon, IonSpinner, IonText
    ],
    templateUrl: './checkout.page.html',
    styleUrls: ['./checkout.page.scss']
})
export class CheckoutPage implements OnInit {
    cartService = inject(CartService);
    private authService = inject(AuthService);
    private firestoreService = inject(FirestoreService);
    private router = inject(Router);

    address = '';
    phone = '';
    notes = '';
    isLoadingPayPal = true;
    orderSuccess = false;
    orderId: string | null = null;
    errorMessage = '';
    private paypalButtonsRendered = false;

    constructor() {
        addIcons({ locationOutline, callOutline, chatboxOutline, checkmarkCircle });
    }

    async ngOnInit(): Promise<void> {
        // Pre-fill user data
        const profile = await this.authService.getUserProfile();
        if (profile) {
            this.address = profile.address || '';
            this.phone = profile.phone || '';
        }
        this.loadPayPalScript();
    }

    loadPayPalScript(): void {
        // Check if script already loaded
        if (typeof paypal !== 'undefined') {
            this.renderPayPalButtons();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypal.clientId}&currency=USD`;
        script.onload = () => {
            this.renderPayPalButtons();
        };
        script.onerror = () => {
            this.isLoadingPayPal = false;
            this.errorMessage = 'Error al cargar PayPal. Intenta refrescar la página.';
        };
        document.body.appendChild(script);
    }

    renderPayPalButtons(): void {
        this.isLoadingPayPal = false;
        const container = document.getElementById('paypal-button-container');
        if (!container) return;
        if (this.paypalButtonsRendered && container.childElementCount > 0) {
            return;
        }

        this.paypalButtonsRendered = true;
        paypal.Buttons({
            style: {
                color: 'gold',
                shape: 'pill',
                label: 'pay',
                height: 48
            },
            createOrder: (data: any, actions: any) => {
                const totalUSD = (this.cartService.total / 4000).toFixed(2); // Approximate COP to USD
                if (!this.address || !this.phone) {
                    this.errorMessage = 'Por favor ingresa tu dirección y teléfono';
                    return;
                }
                if (Number(totalUSD) <= 0) {
                    this.errorMessage = 'El total debe ser mayor a cero';
                    return;
                }
                this.errorMessage = '';
                return actions.order.create({
                    purchase_units: [{
                        description: 'Pedido Fast Pizza',
                        amount: {
                            value: totalUSD
                        }
                    }]
                });
            },
            onApprove: async (data: any, actions: any) => {
                const details = await actions.order.capture();
                await this.createOrder(details.id);
            },
            onCancel: () => {
                this.errorMessage = 'Pago cancelado. Puedes intentarlo nuevamente.';
                this.resetPayPalButtons();
            },
            onError: (err: any) => {
                this.errorMessage = 'Error en el pago. Intenta de nuevo.';
                console.error('PayPal Error', err);
            }
        }).render('#paypal-button-container');
    }

    private resetPayPalButtons(): void {
        const container = document.getElementById('paypal-button-container');
        if (container) {
            container.innerHTML = '';
        }
        this.paypalButtonsRendered = false;
        setTimeout(() => this.renderPayPalButtons());
    }

    async createOrder(transactionId: string): Promise<void> {
        try {
            const user = this.authService.getCurrentUser();
            if (!user) return;

            const orderId = await this.firestoreService.createOrder({
                userId: user.uid,
                userEmail: user.email || '',
                userName: user.displayName || '',
                items: this.cartService.currentItems,
                subtotal: this.cartService.subtotal,
                deliveryFee: this.cartService.deliveryFee,
                total: this.cartService.total,
                address: this.address,
                phone: this.phone,
                status: 'confirmado',
                paypalTransactionId: transactionId,
                notes: this.notes
            });

            this.orderId = orderId;
            this.orderSuccess = true;
            this.cartService.clearCart();
        } catch (error) {
            this.errorMessage = 'Error al crear el pedido. Tu pago fue procesado.';
            console.error('Order creation error:', error);
        }
    }

    viewDeliveryMap(): void {
        this.router.navigate(['/tabs/delivery-map'], {
            queryParams: { orderId: this.orderId, address: this.address }
        });
    }

    goToOrders(): void {
        this.router.navigate(['/tabs/my-orders']);
    }
}
