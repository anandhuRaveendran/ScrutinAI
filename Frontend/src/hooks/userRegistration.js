import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth";
import { loginUser } from "../api/auth";


export const useRegister = () => {
    return useMutation({
        mutationFn: registerUser,
    });
};

export const useLogin = () => {
    return useMutation({
        mutationFn: loginUser,
    });
};
