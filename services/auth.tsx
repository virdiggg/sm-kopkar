import { getItem, setItem, removeItem } from './storage';

export const isSignedIn = async () => {
    const token = await getItem('token');
    return token !== null;
}

export const signIn = async (token: string) => {
    await setItem('token', token);
}

export const signOut = async () => {
    await removeItem('token');
}

export const getToken = async () => {
    return await getItem('token');
}