
export interface UserAuthJSON {
    email: string;
    token: string;
    username: string;
    bio?: string;
    image?: string;
}

export interface UserRO {
    user : UserAuthJSON
}