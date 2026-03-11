export const environment = {
  production: false,
  firebase: {
    apiKey: '<FIREBASE_API_KEY>',
    authDomain: '<FIREBASE_AUTH_DOMAIN>',
    projectId: '<FIREBASE_PROJECT_ID>',
    storageBucket: '<FIREBASE_STORAGE_BUCKET>',
    messagingSenderId: '<FIREBASE_MESSAGING_SENDER_ID>',
    appId: '<FIREBASE_APP_ID>',
    measurementId: '<FIREBASE_MEASUREMENT_ID>'
  },
  openWeatherMapApiKey: '<OPENWEATHER_API_KEY>',
  paypal: {
    clientId: '<PAYPAL_CLIENT_ID>'
  },
  pizzeriaLocation: {
    lat: 4.7110,   // Bogotá default — can change to your city
    lng: -74.0721,
    name: 'Fast Pizza HQ'
  },
  deliveryFee: 5000 // COP $5,000 delivery fee
};
