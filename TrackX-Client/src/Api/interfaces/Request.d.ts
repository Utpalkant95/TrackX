export interface IREQREGISTER {
    name: string,
    email: string,
    password: string
}

export interface IREQLOGIN {
    email: string,
    password: string
}

export interface IUPDATEPASSWORD {
    oldPassword: string,
    newPassword: string
}