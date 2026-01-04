import { useMutation } from "@tanstack/react-query";
import { createAudit } from "../api/audit";

export const useCreateAudit = ({
    onSuccess,
    onError,
    onSettled,
}) => {
    return useMutation({
        mutationFn: createAudit,
        onSuccess,
        onError,
        onSettled,
    });
};
