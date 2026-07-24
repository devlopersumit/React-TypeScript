import { useState, type ChangeEvent, type FormEvent } from "react";
import api from "../api/axios";

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
}

const sanitizeInput = (value: string) =>
    value.replace(/[\u0000-\u001f\u007f]/g, "").trim();

const validateField = (name: keyof UserData, value: string) => {
    const cleanedValue = sanitizeInput(value);

    if (name === "firstName" || name === "lastName") {
        if (!cleanedValue) {
            return `${name === "firstName" ? "First" : "Last"} name is required.`;
        }
        if (cleanedValue.length < 2) {
            return `${name === "firstName" ? "First" : "Last"} name must be at least 2 characters.`;
        }
        if (!/^[A-Za-zÀ-ÿ' -]{2,50}$/.test(cleanedValue)) {
            return `${name === "firstName" ? "First" : "Last"} name contains invalid characters.`;
        }
        return "";
    }

    if (name === "email") {
        if (!cleanedValue) {
            return "Email is required.";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanedValue)) {
            return "Please enter a valid email address.";
        }
        return "";
    }

    if (name === "password") {
        if (!cleanedValue) {
            return "Password is required.";
        }
        if (cleanedValue.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(cleanedValue)) {
            return "Password must include uppercase, lowercase, and a number.";
        }
    }

    return "";
};

const validateForm = (data: UserData) => {
    const nextErrors: FormErrors = {};

    const fields: Array<keyof UserData> = ["firstName", "lastName", "email", "password"];

    fields.forEach((field) => {
        const error = validateField(field, data[field]);
        if (error) {
            nextErrors[field] = error;
        }
    });

    return nextErrors;
};

export function Register() {
    const [form, setForm] = useState<UserData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof UserData;
        const sanitizedValue = sanitizeInput(value);

        setForm((prev) => ({ ...prev, [fieldName]: sanitizedValue }));

        const fieldError = validateField(fieldName, sanitizedValue);
        setErrors((prev) => ({
            ...prev,
            [fieldName]: fieldError,
        }));
    };

    const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof UserData;
        const fieldError = validateField(fieldName, value);

        setErrors((prev) => ({
            ...prev,
            [fieldName]: fieldError,
        }));
    };

    const handleSignupForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const sanitizedForm: UserData = {
            firstName: sanitizeInput(form.firstName),
            lastName: sanitizeInput(form.lastName),
            email: sanitizeInput(form.email).toLowerCase(),
            password: sanitizeInput(form.password),
        };

        const validationErrors = validateForm(sanitizedForm);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setLoading(true);

        try {
            const res = await api.post("/auth/register", sanitizedForm);
            alert(res.data.message);
            window.location.href = "/notes";
        } catch (error: any) {
            alert(error.response?.data?.message || "Registration Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-[#fafafa] font-sans antialiased text-[#1a1a1a]">
            <form
                onSubmit={handleSignupForm}
                className="w-full max-w-[400px] p-8 bg-white border border-[#e5e5e5] rounded-lg shadow-sm"
            >
                <div className="mb-6">
                    <h1 className="text-xl font-semibold tracking-tight text-[#111111]">Create an account</h1>
                    <p className="text-xs text-[#737373] mt-1">Enter your details below to register.</p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="firstName" className="text-xs font-medium text-[#404040]">
                                First name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                maxLength={50}
                                value={form.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={Boolean(errors.firstName)}
                                className={`w-full px-3 py-1.5 text-sm bg-white border rounded-md outline-none transition-colors focus:border-[#171717] ${errors.firstName ? "border-red-500" : "border-[#d4d4d4]"
                                    }`}
                            />
                            {errors.firstName ? <p className="text-xs text-red-600">{errors.firstName}</p> : null}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="lastName" className="text-xs font-medium text-[#404040]">
                                Last name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                maxLength={50}
                                value={form.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={Boolean(errors.lastName)}
                                className={`w-full px-3 py-1.5 text-sm bg-white border rounded-md outline-none transition-colors focus:border-[#171717] ${errors.lastName ? "border-red-500" : "border-[#d4d4d4]"
                                    }`}
                            />
                            {errors.lastName ? <p className="text-xs text-red-600">{errors.lastName}</p> : null}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-xs font-medium text-[#404040]">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            inputMode="email"
                            maxLength={100}
                            value={form.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={Boolean(errors.email)}
                            className={`w-full px-3 py-1.5 text-sm bg-white border rounded-md outline-none transition-colors focus:border-[#171717] ${errors.email ? "border-red-500" : "border-[#d4d4d4]"
                                }`}
                        />
                        {errors.email ? <p className="text-xs text-red-600">{errors.email}</p> : null}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-xs font-medium text-[#404040]">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            maxLength={100}
                            value={form.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={Boolean(errors.password)}
                            className={`w-full px-3 py-1.5 text-sm bg-white border rounded-md outline-none transition-colors focus:border-[#171717] ${errors.password ? "border-red-500" : "border-[#d4d4d4]"
                                }`}
                        />
                        {errors.password ? <p className="text-xs text-red-600">{errors.password}</p> : null}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 px-4 py-2 text-sm font-medium text-white bg-[#171717] rounded-md hover:bg-[#262626] active:bg-[#0a0a0a] transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
}
