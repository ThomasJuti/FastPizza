# 🍕 Fast Pizza App

Aplicación móvil de delivery de pizza construida con **Ionic 8**, **Angular 20** (Standalone Components) y **Firebase**. 
Diseñada como proyecto final de Programación Móvil.

## ✨ Características Principales

- **Autenticación Segura**: Login con Email/Contraseña y Autenticación con Google usando Firebase Auth.
- **Roles de Usuario**: Soporte para perfiles de `Administrador` y `Usuario` normal.
- **Catálogo Dinámico**: Menú de pizzas y bebidas cargado desde Firestore, separado por categorías.
- **Arma tu Pizza**: Funcionalidad para construir una pizza personalizada eligiendo tamaño e ingredientes.
- **Carrito Reactivo**: Gestión del carrito de compras en tiempo real con recuento dinámico.
- **Pagos con PayPal**: Integración completa con el SDK de PayPal (Sandbox) para procesar pagos de los pedidos.
- **Geolocalización y Mapas**: Integración con **Leaflet** para mostrar un mapa interactivo con la ruta desde la pizzería hasta la dirección de entrega del cliente.
- **API de Clima**: Uso de **OpenWeatherMap API** para sugerir pizzas basándose en la temperatura actual.
- **Panel Administrador**: Dashboard exclusivo para administradores, permitiendo:
  - Ver estadísticas de pedidos.
  - Cambiar el estado de los pedidos (Pendiente → Preparando → Enviado → Entregado).
  - Gestionar el menú (Agregar/Editar/Eliminar pizzas y bebidas).
- **UI/UX Premium**: Diseño moderno con "Dark Theme", tipografía Poppins, bordes redondeados, colores cálidos (Naranja/Rojo) y animaciones fluidas.

## 🚀 Tecnologías

- **Frontend**: Ionic Framework 8, Angular 20 (Standalone Components), HTML5, Vanilla SCSS.
- **Backend / DB / Auth**: Firebase (Authentication, Cloud Firestore).
- **APIs**:
  - PayPal Developer SDK (Pagos).
  - OpenWeatherMap API (Clima).
  - Leaflet API / OpenStreetMap (Mapas).

## 📋 Instrucciones de Ejecución

1. Clona el repositorio e instala las dependencias:
   ```bash
   npm install
   ```

2. Configura las variables de entorno en `src/environments/environment.ts` (Firebase credentials, PayPal ClientID, OpenWeather API Key).

3. Ejecuta el servidor de desarrollo en el navegador:
   ```bash
   ionic serve
   ```

## 🛠️ Credenciales de Prueba

Si cuentas con datos seed cargados en Firestore, puedes crear una cuenta nueva y cambiar tu rol a `admin` manualmente en la consola de Firebase Firestore (colección `users`), o simplemente usar la app como cliente estándar de delivery.
