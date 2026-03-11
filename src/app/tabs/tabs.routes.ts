import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { authGuard } from '../guards/auth.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [authGuard],
    children: [
      {
        path: 'menu',
        loadComponent: () =>
          import('../pages/menu/menu.page').then((m) => m.MenuPage),
      },
      {
        path: 'build-pizza',
        loadComponent: () =>
          import('../pages/build-pizza/build-pizza.page').then((m) => m.BuildPizzaPage),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('../pages/cart/cart.page').then((m) => m.CartPage),
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('../pages/checkout/checkout.page').then((m) => m.CheckoutPage),
      },
      {
        path: 'delivery-map',
        loadComponent: () =>
          import('../pages/delivery-map/delivery-map.page').then((m) => m.DeliveryMapPage),
      },
      {
        path: 'my-orders',
        loadComponent: () =>
          import('../pages/my-orders/my-orders.page').then((m) => m.MyOrdersPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../pages/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: '/tabs/menu',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/menu',
    pathMatch: 'full',
  },
];
