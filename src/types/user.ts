export interface UserData {
    email?: string;
    email_verified?: boolean;
    firstname?: string;
    gender?: string;
    lastname?: string;
    phone?: string;
    phone_verified?: boolean;
    role?: string;
    sub?: string;
    username?: string;
    [key: string]: any;
}
