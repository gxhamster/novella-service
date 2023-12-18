"use client";
import { useRouter } from "next/navigation";
import { useForm } from "@mantine/form";
import Image from "next/image";
import { trpc } from "../../_trpc/client";
import { Button, TextInput, PasswordInput } from "@mantine/core";
import LoadingIcon from "@/components/icons/LoadingIcon";
import NovellaLogo from "@/../public/icon.png";
import { Toast } from "@/components/Toast";

type LoginPageInputs = {
  email: string;
  password: string;
};

export default function Login() {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const signInMutation = trpc.auth.login.useMutation({
    onError: (_error) => {
      Toast.Error({
        title: "Could not login",
        message: _error.message,
      });
      throw new Error(_error.message, {
        cause: _error.data,
      });
    },
    onSuccess: () => {
      Toast.Successful({
        title: "Successful",
        message: "Successfully logged in to novella",
      });
      router.replace("/dashboard");
    },
  });

  function signIn(formData: LoginPageInputs) {
    signInMutation.mutate(formData);
  }

  const router = useRouter();

  return (
    <>
      <section className="bg-surface-200/30 min-w-[500px] flex flex-col">
        {/* Banner */}
        <section className="p-6">
          <div className="flex gap-2 items-center">
            <Image
              src={NovellaLogo}
              width={50}
              height={50}
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
            onSubmit={form.onSubmit(signIn)}
          >
            <TextInput
              withAsterisk
              size="md"
              required
              label="Email"
              placeholder="example@gmail.com"
              {...form.getInputProps("email")}
            />
            <PasswordInput
              type="password"
              size="md"
              required
              placeholder="Your password"
              withAsterisk
              label="Password"
              {...form.getInputProps("password")}
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
            <Button
              variant="filled"
              type="submit"
              size="md"
              loading={signInMutation.isLoading}
            >
              Sign in
            </Button>
          </form>
        </div>
      </section>
      <section className="flex items-center justify-center p-40">
        <p className="text-4xl leading-snug text-surface-800">
          Manage your library more efficiently and productively with novella. It
          shouldn&apos;t be hard to do this.👍
        </p>
      </section>
    </>
  );
}
