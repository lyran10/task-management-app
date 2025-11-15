export interface User {
_id: string;
name: string;
email: string;
role: "admin" | "user";
token?: string;
}

export interface Task {
_id: string;
title: string;
description: string;
status: "Pending" | "Completed";
createdAt: string;
}


export interface AuthContextType {
user: User | null;
setUser : React.Dispatch<React.SetStateAction<User | null>>
signin: (email: string, password: string) => Promise<User>;
signup: (name: string, email: string, password: string) => Promise<User>;
signout: () => void;
}


export interface TaskDialogProps {
open: boolean;
handleClose: () => void;
editing: Task | null;
}