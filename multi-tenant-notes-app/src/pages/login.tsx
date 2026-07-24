import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

interface LoginFormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

const sanitizeInput = (value: string) =>
    value.replace(/[\u0000-\u001f\u007f]/g, "");

const validateField = (name: keyof LoginFormData, value: string) => {
    const cleanedValue = sanitizeInput(value).trim();

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
        if (cleanedValue.length < 6) {
            return "Password must be at least 6 characters long.";
        }
    }

    return "";
};

const validateForm = (data: LoginFormData) => {
    const nextErrors: FormErrors = {};

    (Object.keys(data) as Array<keyof LoginFormData>).forEach((field) => {
        const error = validateField(field, data[field]);
        if (error) {
            nextErrors[field] = error;
        }
    });

    return nextErrors;
};

export function Login() {
    const [form, setForm] = useState<LoginFormData>({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof LoginFormData;
        const sanitizedValue = sanitizeInput(value);

        setForm((prev) => ({ ...prev, [fieldName]: sanitizedValue }));
        setErrors((prev) => ({
            ...prev,
            [fieldName]: validateField(fieldName, sanitizedValue),
        }));
    };

    const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof LoginFormData;

        setErrors((prev) => ({
            ...prev,
            [fieldName]: validateField(fieldName, value),
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const sanitizedForm: LoginFormData = {
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
            const res = await api.post("/auth/login", sanitizedForm);
            // alert(res.data.message || "Login successful");
            window.location.href = "/notes";
        } catch (error: any) {
            alert(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4 font-sans text-[#1a1a1a] antialiased">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-[400px] rounded-lg border border-[#e5e5e5] bg-white p-8 shadow-sm"
            >
                <div className="mb-6">
                    <h1 className="text-xl font-semibold tracking-tight text-[#111111]">Welcome back</h1>
                    <p className="mt-1 text-xs text-[#737373]">Sign in to your account.</p>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-xs font-medium text-[#404040]">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            maxLength={100}
                            value={form.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={Boolean(errors.email)}
                            className={`w-full rounded-md border bg-white px-3 py-1.5 text-sm outline-none transition-colors focus:border-[#171717] ${errors.email ? "border-red-500" : "border-[#d4d4d4]"}`}
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
                            autoComplete="current-password"
                            maxLength={100}
                            value={form.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={Boolean(errors.password)}
                            className={`w-full rounded-md border bg-white px-3 py-1.5 text-sm outline-none transition-colors focus:border-[#171717] ${errors.password ? "border-red-500" : "border-[#d4d4d4]"}`}
                        />
                        {errors.password ? <p className="text-xs text-red-600">{errors.password}</p> : null}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full rounded-md bg-[#171717] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#262626] active:bg-[#0a0a0a] disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                <p className="mt-4 text-center text-sm text-[#525252]">
                    Need an account? {" "}
                    <Link to="/register" className="font-medium text-[#111111] hover:underline">
                        Create one
                    </Link>
                </p>
            </form>
        </div>
    );
}
