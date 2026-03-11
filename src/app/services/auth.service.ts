import { Injectable, inject } from '@angular/core';
import {
    Auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    user,
    updateProfile,
    User
} from '@angular/fire/auth';
import {
    Firestore,
    doc,
    setDoc
} from '@angular/fire/firestore';
import { getDoc } from 'firebase/firestore';
import { Observable, from, switchMap, of, map } from 'rxjs';
import { UserProfile } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private auth = inject(Auth);
    private firestore = inject(Firestore);

    // Observable del usuario autenticado
    user$: Observable<User | null>;

    // Observable del perfil completo con rol
    userProfile$: Observable<UserProfile | null>;

    constructor() {
        this.user$ = user(this.auth);

        // The warning "Firebase API called outside injection context: getDoc/collectionData" 
        // usually happens when AngularFire observables are constructed lazily outside the DI context.
        this.userProfile$ = this.user$.pipe(
            switchMap((u: User | null) => {
                if (!u) return of(null);

                return new Observable<UserProfile | null>(subscriber => {
                    const userDocRef = doc(this.firestore, `users/${u.uid}`);
                    import('@angular/fire/firestore').then(({ onSnapshot }) => {
                        const unsubscribe = onSnapshot(userDocRef, (snap) => {
                            if (snap.exists()) {
                                subscriber.next({ uid: snap.id, ...snap.data() } as UserProfile);
                            } else {
                                subscriber.next(null);
                            }
                        }, (error) => {
                            subscriber.error(error);
                        });
                        return unsubscribe;
                    });
                });
            })
        );
    }

    // Registrar con email y contraseña
    async register(email: string, password: string, displayName: string, phone: string, address: string): Promise<void> {
        const credential = await createUserWithEmailAndPassword(this.auth, email, password);
        await updateProfile(credential.user, { displayName });

        // Crear perfil en Firestore con rol 'user'
        const userProfile: UserProfile = {
            uid: credential.user.uid,
            email,
            displayName,
            role: 'user',
            phone,
            address
        };
        await setDoc(doc(this.firestore, `users/${credential.user.uid}`), userProfile);
    }

    // Login con email y contraseña
    async loginWithEmail(email: string, password: string): Promise<void> {
        await signInWithEmailAndPassword(this.auth, email, password);
    }

    // Cerrar sesión
    async logout(): Promise<void> {
        await signOut(this.auth);
    }

    // Obtener el usuario actual (no observable)
    getCurrentUser(): User | null {
        return this.auth.currentUser;
    }

    // Verificar si es admin
    async isAdmin(): Promise<boolean> {
        const u = this.auth.currentUser;
        if (!u) return false;
        const userDoc = await getDoc(doc(this.firestore, `users/${u.uid}`));
        const data = userDoc.data() as UserProfile;
        return data?.role === 'admin';
    }

    // Obtener perfil del usuario actual
    async getUserProfile(): Promise<UserProfile | null> {
        const u = this.auth.currentUser;
        if (!u) return null;
        const userDoc = await getDoc(doc(this.firestore, `users/${u.uid}`));
        return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
    }

    // Actualizar perfil
    async updateUserProfile(data: Partial<UserProfile>): Promise<void> {
        const u = this.auth.currentUser;
        if (!u) return;
        await setDoc(doc(this.firestore, `users/${u.uid}`), data, { merge: true });
    }
}
