import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
    IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { timeOutline, locationOutline, mapOutline } from 'ionicons/icons';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/order.model';

@Component({
    selector: 'app-my-orders',
    standalone: true,
    imports: [
        CommonModule,
        IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonSpinner
    ],
    templateUrl: './my-orders.page.html',
    styleUrls: ['./my-orders.page.scss']
})
export class MyOrdersPage implements OnInit {
    private firestoreService = inject(FirestoreService);
    private authService = inject(AuthService);
    private router = inject(Router);

    orders: Order[] = [];
    isLoading = true;

    constructor() {
        addIcons({ timeOutline, locationOutline, mapOutline });
    }

    ngOnInit(): void {
        const user = this.authService.getCurrentUser();
        if (user) {
            this.firestoreService.getUserOrders(user.uid).subscribe(orders => {
                this.orders = orders;
                this.isLoading = false;
            });
        }
    }

    getStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            pendiente: 'Pendiente',
            confirmado: 'Confirmado',
            preparando: 'Preparando',
            enviado: 'En camino',
            entregado: 'Entregado',
            cancelado: 'Cancelado'
        };
        return labels[status] || status;
    }

    formatDate(timestamp: any): string {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    viewMap(order: Order): void {
        this.router.navigate(['/tabs/delivery-map'], {
            queryParams: { orderId: order.id, address: order.address }
        });
    }

    goToMenu(): void {
        this.router.navigate(['/tabs/menu']);
    }
}
