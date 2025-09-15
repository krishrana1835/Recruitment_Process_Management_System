import type { Roles } from "./Roles_interface";

export interface User{
    user_id: string;
    name: string;
    email: string;
}

export interface UsersList extends User{
    role: Roles[];
}

export interface UserInfo extends User{
    role: Roles[];
    created_at: Date;
}