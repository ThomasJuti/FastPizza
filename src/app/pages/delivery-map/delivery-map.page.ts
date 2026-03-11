import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonBackButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline, navigateOutline } from 'ionicons/icons';
import { environment } from '../../../environments/environment';
import * as L from 'leaflet';

@Component({
    selector: 'app-delivery-map',
    standalone: true,
    imports: [
        CommonModule,
        IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
        IonBackButton, IonIcon
    ],
    templateUrl: './delivery-map.page.html',
    styleUrls: ['./delivery-map.page.scss']
})
export class DeliveryMapPage implements OnInit, AfterViewInit {
    private route = inject(ActivatedRoute);

    pizzeriaName = environment.pizzeriaLocation.name;
    deliveryAddress = '';
    private map!: L.Map;

    // Locations
    private pizzeriaLat = environment.pizzeriaLocation.lat;
    private pizzeriaLng = environment.pizzeriaLocation.lng;
    // Simulated delivery location (slightly offset from pizzeria)
    private deliveryLat = environment.pizzeriaLocation.lat + 0.015;
    private deliveryLng = environment.pizzeriaLocation.lng + 0.02;

    constructor() {
        addIcons({ locationOutline, navigateOutline });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.deliveryAddress = params['address'] || 'Dirección del cliente';
        });
    }

    ngAfterViewInit(): void {
        setTimeout(() => this.initMap(), 300);
    }

    private initMap(): void {
        // Fix Leaflet default icon issue
        const iconDefault = L.icon({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        this.map = L.map('delivery-map', {
            center: [this.pizzeriaLat, this.pizzeriaLng],
            zoom: 14,
            zoomControl: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(this.map);

        // Pizzeria marker (red)
        const pizzeriaIcon = L.divIcon({
            html: '<div style="background:#E63946;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">🍕</div>',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            className: ''
        });

        L.marker([this.pizzeriaLat, this.pizzeriaLng], { icon: pizzeriaIcon })
            .addTo(this.map)
            .bindPopup('<b>🍕 Fast Pizza HQ</b><br/>Tu pizza se prepara aquí')
            .openPopup();

        // Delivery marker (green)
        const deliveryIcon = L.divIcon({
            html: '<div style="background:#2ecc71;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">📍</div>',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            className: ''
        });

        L.marker([this.deliveryLat, this.deliveryLng], { icon: deliveryIcon })
            .addTo(this.map)
            .bindPopup('<b>📍 Tu dirección</b><br/>' + (this.deliveryAddress || 'Destino de entrega'));

        // Draw route line
        const routeLine = L.polyline(
            [
                [this.pizzeriaLat, this.pizzeriaLng],
                [this.deliveryLat, this.deliveryLng]
            ],
            {
                color: '#F4A261',
                weight: 4,
                opacity: 0.8,
                dashArray: '10, 10'
            }
        ).addTo(this.map);

        // Fit bounds to show both markers
        const bounds = L.latLngBounds(
            [this.pizzeriaLat, this.pizzeriaLng],
            [this.deliveryLat, this.deliveryLng]
        );
        this.map.fitBounds(bounds, { padding: [50, 50] });
    }
}
