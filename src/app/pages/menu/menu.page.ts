import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel,
  IonBadge, IonSpinner, IonSearchbar, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cartOutline, logOutOutline, constructOutline,
  flameOutline, leafOutline, starOutline, addCircle,
  searchOutline, locationOutline, chevronDownOutline, notificationsOutline,
  fastFoodOutline, pizzaOutline, cafeOutline, add, flame, sunnyOutline
} from 'ionicons/icons';
import { FirestoreService } from '../../services/firestore.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { Pizza } from '../../models/pizza.model';
import { Beverage } from '../../models/beverage.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel,
    IonBadge, IonSpinner, IonSearchbar, IonSelect, IonSelectOption
  ],
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss']
})
export class MenuPage implements OnInit {
  @ViewChild('citySelect') citySelect!: IonSelect;

  private firestoreService = inject(FirestoreService);
  private weatherService = inject(WeatherService);
  private authService = inject(AuthService);
  private router = inject(Router);
  cartService = inject(CartService);

  selectedSegment: string = 'pizzas';
  selectedCategory: string = 'todas';
  pizzas: Pizza[] = [];
  filteredPizzas: Pizza[] = [];
  beverages: Beverage[] = [];
  weather: WeatherData | null = null;
  weatherMessage = '';
  isLoading = true;
  selectedCity = 'Bogota';

  cities: { value: string; label: string }[] = [
    { value: 'Bogota', label: 'Bogotá' },
    { value: 'Medellin', label: 'Medellín' },
    { value: 'Cali', label: 'Cali' },
    { value: 'Barranquilla', label: 'Barranquilla' },
    { value: 'Cartagena', label: 'Cartagena' },
    { value: 'Bucaramanga', label: 'Bucaramanga' },
    { value: 'Santa Marta', label: 'Santa Marta' },
    { value: 'Pereira', label: 'Pereira' },
    { value: 'Manizales', label: 'Manizales' },
    { value: 'Cucuta', label: 'Cúcuta' },
    { value: 'Ibague', label: 'Ibagué' },
    { value: 'Villavicencio', label: 'Villavicencio' },
    { value: 'Pasto', label: 'Pasto' },
    { value: 'Monteria', label: 'Montería' },
    { value: 'Valledupar', label: 'Valledupar' },
  ];

  get selectedCityLabel(): string {
    const found = this.cities.find(c => c.value === this.selectedCity);
    return found ? `${found.label}, Colombia` : 'Bogotá, Colombia';
  }

  constructor() {
    addIcons({ cartOutline, logOutOutline, constructOutline, flameOutline, leafOutline, starOutline, addCircle, searchOutline, locationOutline, chevronDownOutline, notificationsOutline, fastFoodOutline, pizzaOutline, cafeOutline, add, flame, sunnyOutline });
  }

  ngOnInit(): void {
    this.loadData();
    this.loadWeather();
  }

  loadData(): void {
    this.isLoading = true;
    this.firestoreService.getPizzas().subscribe(pizzas => {
      this.pizzas = pizzas.filter(p => p.available);
      this.filterCategory(this.selectedCategory);
      this.isLoading = false;
    });

    this.firestoreService.getBeverages().subscribe(beverages => {
      this.beverages = beverages.filter(b => b.available);
    });
  }

  loadWeather(city?: string): void {
    const cityToLoad = city ?? this.selectedCity;
    this.weatherService.getWeatherByCity(cityToLoad).subscribe({
      next: (data) => {
        this.weather = data;
        this.weatherMessage = this.weatherService.getPizzaMessage(data.temperature);
      },
      error: () => {
        console.log('Could not load weather data');
      }
    });
  }

  openCitySelect(): void {
    this.citySelect?.open();
  }

  onCityChange(event: Event): void {
    const ev = event as CustomEvent<{ value: string }>;
    const city = ev.detail?.value;
    if (city) {
      this.selectedCity = city;
      this.loadWeather(city);
    }
  }

  onSegmentChange(event: any): void {
    this.selectedSegment = event.detail.value;
  }

  filterCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'todas') {
      this.filteredPizzas = this.pizzas;
    } else {
      this.filteredPizzas = this.pizzas.filter(p => p.category === category);
    }
  }

  addPizzaToCart(pizza: Pizza, event: Event): void {
    event.stopPropagation();
    this.cartService.addItem({
      type: 'pizza',
      name: pizza.name,
      description: pizza.description,
      image: pizza.image,
      price: pizza.price
    });
  }

  addBeverageToCart(beverage: Beverage): void {
    this.cartService.addItem({
      type: 'beverage',
      name: beverage.name,
      image: beverage.image,
      price: beverage.price,
      size: beverage.size
    });
  }

  viewPizzaDetail(pizza: Pizza): void {
    // For now, just add to cart. Could expand into a detail modal later.
  }

  goToCart(): void {
    this.router.navigate(['/tabs/cart']);
  }

  goToBuildPizza(): void {
    this.router.navigate(['/tabs/build-pizza']);
  }
}
