"use client";
import { useRouter } from "next/navigation";
import NovellaInput from "@/components/NovellaInput";
import { signInWithEmail } from "@/supabase/auth";
import { useForm, SubmitHandler } from "react-hook-form";

type LoginPageInputs = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPageInputs>();

  const router = useRouter();

  const signInSupabase: SubmitHandler<LoginPageInputs> = async (formData) => {
    const { data, error } = await signInWithEmail(
      formData.email,
      formData.password
    );
    if (error) {
      console.error("Cannot sign into Novella :(", error);
    } else {
      console.log("Succesfully signed into Novella :)", data.user);
      router.push("/dashboard");
    }
  };

  return (
    <main className="flex flex-col min-h-screen items-center px-16 bg-surface-100 text-white">
      <section className="p-10">
        <div className="flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <h2 className="text-4xl font-semibold">Novella</h2>
        </div>
      </section>
      <section className="bg-surface-200 p-12 flex flex-col gap-10 w-1/3 min-w-[450px] rounded-md min-h-[500px]">
        <section className="flex flex-col gap-2">
          <h3 className="text-surface-700 text-2xl font-bold">Welcome back</h3>
          <span className="text-surface-600">Sign in to your account</span>
        </section>
        <form
          className="flex flex-col gap-8"
          onSubmit={handleSubmit(signInSupabase)}
        >
          <NovellaInput<"email">
            type="email"
            title="Email"
            placeholder="example@gmail.com"
            reactHookErrorMessage={errors.email}
            reactHookRegister={register("email", {
              required: "Email address is required",
            })}
          />
          <NovellaInput<"password">
            type="password"
            title="Password"
            placeholder="Enter a password"
            reactHookErrorMessage={errors.password}
            reactHookRegister={register("password", {
              required: "Password is required",
            })}
          />
          <div className="text-sm text-surface-600">
            <span>If you want to register to this service. </span>
            <a href="#" className="underline font-bold hover:text-surface-700">
              Click Here
            </a>
          </div>
          <button className="bg-primary-500 px-4 py-2 text-black-100 rounded-md">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
