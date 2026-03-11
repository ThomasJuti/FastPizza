export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: 'user' | 'admin';
    address?: string;
    phone?: string;
    photoURL?: string;
}
