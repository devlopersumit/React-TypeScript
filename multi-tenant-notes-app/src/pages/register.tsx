import { useState, ChangeEvent, FormEvent } from "react";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function Register() {
  const [form, setForm] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Submit logic
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
              <label htmlFor="firstName" className="text-xs font-medium text-[#404040]">First name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={form.firstName}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-sm bg-white border border-[#d4d4d4] rounded-md outline-none transition-colors focus:border-[#171717]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="lastName" className="text-xs font-medium text-[#404040]">Last name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={form.lastName}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-sm bg-white border border-[#d4d4d4] rounded-md outline-none transition-colors focus:border-[#171717]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-[#404040]">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-sm bg-white border border-[#d4d4d4] rounded-md outline-none transition-colors focus:border-[#171717]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-medium text-[#404040]">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-sm bg-white border border-[#d4d4d4] rounded-md outline-none transition-colors focus:border-[#171717]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 px-4 py-2 text-sm font-medium text-white bg-[#171717] rounded-md hover:bg-[#262626] active:bg-[#0a0a0a] transition-colors cursor-pointer"
        >
          Register
        </button>
      </form>
    </div>
  );
}
