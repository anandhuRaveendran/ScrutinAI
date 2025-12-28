import * as yup from "yup";

export const registerSchema = yup.object().shape({
    firstName: yup
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters")
        .required("First name is required"),

    lastName: yup
        .string()
        .trim()
        .min(2, "Last name must be at least 2 characters")
        .required("Last name is required"),

    email: yup
        .string()
        .email("Enter a valid email address")
        .required("Email is required"),

    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .required("Password is required"),
});
