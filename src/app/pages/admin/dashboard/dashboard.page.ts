import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    IonContent, IonHeader, IonToolbar, IonTitle, IonIcon,
    IonSpinner, IonButtons, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    logOutOutline, checkmarkCircle, timerOutline, bicycleOutline,
    restaurantOutline, bagCheckOutline, closeCircleOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../services/firestore.service';
import { AuthService } from '../../../services/auth.service';
import { Order } from '../../../models/order.model';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        IonContent, IonHeader, IonToolbar, IonTitle, IonIcon,
        IonSpinner, IonButtons, IonButton
    ],
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss']
})
export class AdminDashboardPage implements OnInit {
    private firestoreService = inject(FirestoreService);
    private authService = inject(AuthService);
    private router = inject(Router);

    orders: Order[] = [];
    isLoading = true;
    activeFilter = 'todos';

    statusFilters = [
        { value: 'todos', label: 'Todos' },
        { value: 'pendiente', label: 'Pendientes' },
        { value: 'confirmado', label: 'Confirmados' },
        { value: 'preparando', label: 'Preparando' },
        { value: 'enviado', label: 'Enviados' },
        { value: 'entregado', label: 'Entregados' },
    ];

    constructor() {
        addIcons({
            logOutOutline, checkmarkCircle, timerOutline, bicycleOutline,
            restaurantOutline, bagCheckOutline, closeCircleOutline
        });
    }

    ngOnInit(): void {
        this.firestoreService.getOrders().subscribe(orders => {
            this.orders = orders;
            this.isLoading = false;
        });
    }

    get filteredOrders(): Order[] {
        if (this.activeFilter === 'todos') return this.orders;
        return this.orders.filter(o => o.status === this.activeFilter);
    }

    get pendingCount(): number {
        return this.orders.filter(o => o.status === 'pendiente' || o.status === 'confirmado').length;
    }

    get preparingCount(): number {
        return this.orders.filter(o => o.status === 'preparando').length;
    }

    get sentCount(): number {
        return this.orders.filter(o => o.status === 'enviado').length;
    }

    get deliveredCount(): number {
        return this.orders.filter(o => o.status === 'entregado').length;
    }

    getStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            pendiente: 'Pendiente', confirmado: 'Confirmado', preparando: 'Preparando',
            enviado: 'En camino', entregado: 'Entregado', cancelado: 'Cancelado'
        };
        return labels[status] || status;
    }

    async updateStatus(orderId: string, status: Order['status']): Promise<void> {
        await this.firestoreService.updateOrderStatus(orderId, status);
    }

    async seedData(): Promise<void> {
        await this.firestoreService.seedMenu();
        alert('✅ Datos de ejemplo cargados exitosamente');
    }

    goToManageMenu(): void {
        this.router.navigate(['/admin/manage-menu']);
    }

    async logout(): Promise<void> {
        await this.authService.logout();
        this.router.navigate(['/login']);
    }
}
