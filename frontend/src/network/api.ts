import axios from "axios";
import { UserObject } from "../models/userObject";
import { UserData } from "../models/userData";

export async function getUser(): Promise<UserObject> {
    const { data } = await axios.get<UserObject>("/users");
    return data;
}

export interface SignUpCredentials {
    fullname: string,
    username: string,
    email: string,
    password: string,
}

export async function signUp(credentials: SignUpCredentials): Promise<UserObject> {
    const response = await axios.post<UserObject>("/users/signup", credentials, { headers: { "Content-Type": "application/json" } })

    return response.data
}

export interface LoginCredentials {
    email: string,
    password: string
}

export async function login(credentials: LoginCredentials): Promise<UserObject> {
    const response = await axios.post<UserObject>("/users/login", credentials, { headers: { "Content-Type": "application/json" } })

    return response.data
}

export interface ProfileCredentials {
    race: string,
    bio: string,
    base: string,
    origin: string,
}

export async function updateProfile(credentials: ProfileCredentials): Promise<UserData> {
    const response = await axios.put('/data/userData', credentials, { headers: { "Content-Type": "application/json" } });
    
    return response.data;
}