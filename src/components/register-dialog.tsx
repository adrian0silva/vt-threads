"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

const formSchema = z
  .object({
    username: z
      .string("Nome de usuario inválido.")
      .trim()
      .min(1, "Nome de usuario é obrigatório."),
    email: z.email("E-mail inválido."),
    password: z.string("Senha inválida.").min(8, "Senha inválida."),
    passwordConfirmation: z.string("Senha inválida.").min(8, "Senha inválida."),
  })
  .refine(
    (data) => {
      return data.password === data.passwordConfirmation;
    },
    {
      error: "As senhas não coincidem.",
      path: ["passwordConfirmation"],
    },
  );

type FormValues = z.infer<typeof formSchema>;
export function RegisterDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  async function onSubmit(values: FormValues) {
    console.log(values);

    const { data, error } = await authClient.signUp.email({
      name: values.username,
      email: values.email,
      password: values.password,
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
        onError: (error) => {
          if (error.error.message === "USER_ALREADY_EXISTS") {
            toast.error("E-mail já cadastrado");
            form.setError("email", { message: "E-mail já cadastrado" });
          }
          toast.error(error.error.message);
        },
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          Registrar
        </Button>
      </DialogTrigger>
      <DialogContent className="border border-gray-200 bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Registrar
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Preencha seus dados para criar sua conta.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="reg-name">Nome completo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        id="reg-name"
                        placeholder="Seu nome"
                        className="pl-9"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="reg-email">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="voce@email.com"
                        className="pl-9"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="reg-password">Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        id="reg-password"
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        className="pr-10 pl-9"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 right-1 -translate-y-1/2"
                        onClick={() => setShowPass((s) => !s)}
                        aria-label={
                          showPass ? "Ocultar senha" : "Mostrar senha"
                        }
                      >
                        {showPass ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="reg-confirm">Confirmar senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        id="reg-confirm"
                        type={showConfirm ? "text" : "password"}
                        placeholder="••••••••"
                        className="pr-10 pl-9"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 right-1 -translate-y-1/2"
                        onClick={() => setShowConfirm((s) => !s)}
                        aria-label={
                          showConfirm
                            ? "Ocultar confirmação"
                            : "Mostrar confirmação"
                        }
                      >
                        {showConfirm ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2">
              <Checkbox id="tos" required />
              <Label htmlFor="tos" className="text-sm font-normal">
                Aceito os{" "}
                {/* <Link href="/terms" className="underline">
                  Termos
                </Link>{" "}
                e a{" "}
                <Link href="/privacy" className="underline">
                  Privacidade
                </Link> */}
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Registrar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
