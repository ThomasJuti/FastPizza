import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonBackButton, IonButton, IonIcon, IonSpinner, IonChip, IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline, addCircle, removeCircle, checkmarkCircle } from 'ionicons/icons';
import { FirestoreService } from '../../services/firestore.service';
import { CartService } from '../../services/cart.service';
import { Ingredient } from '../../models/pizza.model';

@Component({
    selector: 'app-build-pizza',
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
        IonBackButton, IonButton, IonIcon, IonSpinner, IonChip, IonLabel
    ],
    templateUrl: './build-pizza.page.html',
    styleUrls: ['./build-pizza.page.scss']
})
export class BuildPizzaPage implements OnInit {
    private firestoreService = inject(FirestoreService);
    private cartService = inject(CartService);
    private router = inject(Router);

    ingredients: Ingredient[] = [];
    selectedIngredients: Ingredient[] = [];
    selectedSize: string = 'mediana';
    basePrice = 18000;
    isLoading = true;

    sizes = [
        { value: 'personal', label: 'Personal', icon: '🔸', basePrice: 12000 },
        { value: 'mediana', label: 'Mediana', icon: '🔶', basePrice: 18000 },
        { value: 'grande', label: 'Grande', icon: '🟠', basePrice: 24000 },
        { value: 'familiar', label: 'Familiar', icon: '🟤', basePrice: 30000 },
    ];

    ingredientCategories = [
        { key: 'salsa', label: 'Salsas', icon: '🫙' },
        { key: 'queso', label: 'Quesos', icon: '🧀' },
        { key: 'proteina', label: 'Proteínas', icon: '🥩' },
        { key: 'vegetal', label: 'Vegetales', icon: '🥬' },
    ];

    constructor() {
        addIcons({ cartOutline, addCircle, removeCircle, checkmarkCircle });
    }

    ngOnInit(): void {
        this.firestoreService.getIngredients().subscribe(ingredients => {
            this.ingredients = ingredients;
            this.isLoading = false;
        });
    }

    selectSize(size: string, price: number): void {
        this.selectedSize = size;
        this.basePrice = price;
    }

    getIngredientsByCategory(category: string): Ingredient[] {
        return this.ingredients.filter(i => i.category === category);
    }

    isSelected(ingredient: Ingredient): boolean {
        return this.selectedIngredients.some(i => i.id === ingredient.id);
    }

    toggleIngredient(ingredient: Ingredient): void {
        if (this.isSelected(ingredient)) {
            this.selectedIngredients = this.selectedIngredients.filter(i => i.id !== ingredient.id);
        } else {
            this.selectedIngredients = [...this.selectedIngredients, ingredient];
        }
    }

    get totalPrice(): number {
        const ingredientsCost = this.selectedIngredients.reduce((sum, i) => sum + i.price, 0);
        return this.basePrice + ingredientsCost;
    }

    addToCart(): void {
        const ingredientNames = this.selectedIngredients.map(i => i.name).join(', ');
        this.cartService.addItem({
            type: 'custom-pizza',
            name: `Pizza Personalizada (${this.selectedSize})`,
            description: ingredientNames || 'Sin ingredientes extra',
            price: this.totalPrice,
            ingredients: this.selectedIngredients,
            size: this.selectedSize
        });
        this.router.navigate(['/tabs/cart']);
    }
}
