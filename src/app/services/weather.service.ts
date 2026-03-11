import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WeatherData {
    temperature: number;
    description: string;
    icon: string;
    city: string;
    feelsLike: number;
    humidity: number;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
    private http = inject(HttpClient);
    private apiKey = environment.openWeatherMapApiKey;
    private baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

    getWeather(lat: number, lon: number): Observable<WeatherData> {
        const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=es`;
        return this.http.get<any>(url).pipe(
            map(res => ({
                temperature: Math.round(res.main.temp),
                description: res.weather[0].description,
                icon: `https://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`,
                city: res.name,
                feelsLike: Math.round(res.main.feels_like),
                humidity: res.main.humidity
            }))
        );
    }

    getWeatherByCity(city: string): Observable<WeatherData> {
        const url = `${this.baseUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=es`;
        return this.http.get<any>(url).pipe(
            map(res => ({
                temperature: Math.round(res.main.temp),
                description: res.weather[0].description,
                icon: `https://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`,
                city: res.name,
                feelsLike: Math.round(res.main.feels_like),
                humidity: res.main.humidity
            }))
        );
    }

    getPizzaMessage(temp: number): string {
        if (temp >= 30) return '🔥 ¡Día caliente! Una pizza fría de vegetales es ideal';
        if (temp >= 20) return '☀️ ¡Día perfecto para disfrutar una pizza al aire libre!';
        if (temp >= 10) return '🌤️ Un poco fresco... ¡Pizza caliente es la respuesta!';
        return '🥶 ¡Hace frío! Nada mejor que una pizza recién salida del horno';
    }
}
