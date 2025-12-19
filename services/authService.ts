import { auth } from './firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updateProfile,
    User as FirebaseUser
} from 'firebase/auth';
import { User } from '../types';

export const login = async (email: string, password: string): Promise<User> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;

        // Map Firebase user to our App User type
        return {
            id: fbUser.uid,
            name: fbUser.displayName || email?.split('@')[0] || 'User',
            email: fbUser.email || '',
            role: 'Admin', // Default role for now, ideally fetched from DB
            password: '', // Don't keep password
            avatar: (fbUser.displayName || email || 'U')[0].toUpperCase()
        };
    } catch (error) {
        throw error;
    }
};

export const signUp = async (email: string, password: string, name: string): Promise<User> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;

        await updateProfile(fbUser, { displayName: name });

        return {
            id: fbUser.uid,
            name: name,
            email: fbUser.email || '',
            role: 'Downloader',
            password: '',
            avatar: name[0].toUpperCase()
        };
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    await firebaseSignOut(auth);
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
            callback({
                id: fbUser.uid,
                name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
                email: fbUser.email || '',
                role: 'Admin',
                password: '',
                avatar: (fbUser.displayName || fbUser.email || 'U')[0].toUpperCase()
            });
        } else {
            callback(null);
        }
    });
};
