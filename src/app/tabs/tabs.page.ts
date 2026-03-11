import { Component, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, bagHandleOutline, receiptOutline, personOutline } from 'ionicons/icons';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge],
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss']
})
export class TabsPage {
  cartService = inject(CartService);

  constructor() {
    addIcons({ homeOutline, bagHandleOutline, receiptOutline, personOutline });
  }
}
