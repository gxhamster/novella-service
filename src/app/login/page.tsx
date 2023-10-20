"use client";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import NovellaInput from "@/components/NovellaInput";
import NButton from "@/components/NButton";
import NovellaLogo from "../../../public/icon.png";
import { trpc } from "../_trpc/client";
import { toast } from "react-toastify";

type LoginPageInputs = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPageInputs>();

  const signInMutation = trpc.auth.login.useMutation({
    onError: (_error) => {
      toast.error(`Could not login due to: ${_error.message}`);
      throw new Error(_error.message, {
        cause: _error.data,
      });
    },
    onSuccess: () => {
      toast.success("Succesfully logged in to novella 👍");
      router.push("/dashboard");
    },
  });

  const router = useRouter();
  const signInSupabase: SubmitHandler<LoginPageInputs> = async (formData) => {
    signInMutation.mutate(formData);
  };

  return (
    <>
      <section className="bg-surface-200/30 min-w-[500px] flex flex-col">
        {/* Banner */}
        <section className="p-6">
          <div className="flex gap-2 items-center">
            <Image
              src={NovellaLogo}
              width={40}
              height={40}
              alt="Novella Logo"
            />
            <h2 className="text-2xl font-semibold text-surface-900">novella</h2>
          </div>
        </section>

        {/* Login Form */}
        <div className="px-16 py-10 flex flex-col gap-10">
          <section className="flex flex-col gap-2">
            <h3 className="text-3xl text-surface-900">Welcome back</h3>
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
              <a
                href="#"
                className="underline font-bold hover:text-surface-700"
              >
                Click Here
              </a>
            </div>
            <NButton
              kind="primary"
              size="normal"
              title="Sign in"
              className="text-center"
              isLoading={signInMutation.isLoading}
            />
          </form>
        </div>
      </section>
      <section className="flex items-center justify-center p-40">
        <p className="text-5xl leading-snug">
          Manage your library more efficiently and productively with novella. It
          shouldn't be hard to do this. 👍
        </p>
      </section>
    </>
  );
}
