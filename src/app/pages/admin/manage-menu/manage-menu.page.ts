import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonBackButton, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline, closeOutline } from 'ionicons/icons';
import { FirestoreService } from '../../../services/firestore.service';
import { Pizza } from '../../../models/pizza.model';
import { Beverage } from '../../../models/beverage.model';

@Component({
    selector: 'app-manage-menu',
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
        IonBackButton, IonIcon, IonSpinner
    ],
    templateUrl: './manage-menu.page.html',
    styleUrls: ['./manage-menu.page.scss']
})
export class ManageMenuPage implements OnInit {
    private firestoreService = inject(FirestoreService);

    pizzas: Pizza[] = [];
    beverages: Beverage[] = [];
    showPizzaForm = false;
    showBeverageForm = false;

    newPizza: Partial<Pizza> = {
        name: '', description: '', image: '', price: 0,
        category: 'clasica', ingredients: [], available: true
    };

    newBeverage: Partial<Beverage> = {
        name: '', image: '', price: 0, size: '',
        category: 'gaseosa', available: true
    };

    constructor() {
        addIcons({ addOutline, createOutline, trashOutline, closeOutline });
    }

    ngOnInit(): void {
        this.firestoreService.getPizzas().subscribe(p => this.pizzas = p);
        this.firestoreService.getBeverages().subscribe(b => this.beverages = b);
    }

    async savePizza(): Promise<void> {
        if (!this.newPizza.name || !this.newPizza.price) return;
        await this.firestoreService.addPizza(this.newPizza as Pizza);
        this.newPizza = { name: '', description: '', image: '', price: 0, category: 'clasica', ingredients: [], available: true };
        this.showPizzaForm = false;
    }

    async deletePizza(id: string): Promise<void> {
        if (confirm('¿Eliminar esta pizza?')) {
            await this.firestoreService.deletePizza(id);
        }
    }

    async saveBeverage(): Promise<void> {
        if (!this.newBeverage.name || !this.newBeverage.price) return;
        await this.firestoreService.addBeverage(this.newBeverage as Beverage);
        this.newBeverage = { name: '', image: '', price: 0, size: '', category: 'gaseosa', available: true };
        this.showBeverageForm = false;
    }

    async deleteBeverage(id: string): Promise<void> {
        if (confirm('¿Eliminar esta bebida?')) {
            await this.firestoreService.deleteBeverage(id);
        }
    }
}
