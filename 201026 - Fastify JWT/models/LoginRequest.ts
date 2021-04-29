export interface LoginRequest{
    id: number,
    username: string,
    password: string,
    email: string | null,
    name: string | null,
    surname: string | null
}