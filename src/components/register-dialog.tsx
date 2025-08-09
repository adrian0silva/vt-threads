"use client"

import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RegisterDialog() {
  const [open, setOpen] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const pass = (form.elements.namedItem("password") as HTMLInputElement)?.value
    const confirm = (form.elements.namedItem("confirm") as HTMLInputElement)?.value
    if (pass !== confirm) {
      alert("As senhas não coincidem.")
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Register</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar conta</DialogTitle>
          <DialogDescription>Preencha seus dados para começar.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reg-name">Nome completo</Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="reg-name" name="name" placeholder="Seu nome" className="pl-9" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="reg-email" name="email" type="email" placeholder="voce@email.com" className="pl-9" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-password">Senha</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="reg-password" name="password" type={showPass ? "text" : "password"} placeholder="••••••••" className="pl-9 pr-10" required />
              <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2" onClick={() => setShowPass(s => !s)} aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}>
                {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-confirm">Confirmar senha</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="reg-confirm" name="confirm" type={showConfirm ? "text" : "password"} placeholder="••••••••" className="pl-9 pr-10" required />
              <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2" onClick={() => setShowConfirm(s => !s)} aria-label={showConfirm ? "Ocultar confirmação" : "Mostrar confirmação"}>
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="tos" required />
            <Label htmlFor="tos" className="text-sm font-normal">
              Aceito os <Link href="/terms" className="underline">Termos</Link> e a <Link href="/privacy" className="underline">Privacidade</Link>
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
