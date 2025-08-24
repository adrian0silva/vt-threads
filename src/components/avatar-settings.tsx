"use client"

import { Upload, X } from "lucide-react"
import { CldUploadButton } from "next-cloudinary"
import { useState } from "react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface AvatarSettingsProps {
  user: User
}

export function AvatarSettings({ user }: AvatarSettingsProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.image ?? null)

  const handleUpload = async (secureUrl: string) => {
    try {
      const res = await fetch("/api/user/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: secureUrl, userId: user.id }),
      })

      if (!res.ok) throw new Error("Falha ao salvar avatar no banco")

      setPreviewUrl(secureUrl)
      toast.success("Avatar atualizado com sucesso!")
    } catch (err) {
      console.error(err)
      toast.error("Erro ao salvar avatar no banco.")
    }
  }

  const handleRemoveAvatar = async () => {
    try {
      await fetch("/api/user/avatar", {
        method: "DELETE",
      })

      setPreviewUrl(null)
      toast.success("Avatar removido com sucesso!")
      window.location.reload()
    } catch (error) {
      console.error("Error removing avatar:", error)
      toast.error("Falha ao remover o avatar. Tente novamente.")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={previewUrl || undefined} alt={user.name || "User"} />
          <AvatarFallback className="text-lg">
            {user.name?.split(" ")?.[0]?.[0]}
            {user.name?.split(" ")?.[1]?.[0]}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          {/* Botão de upload direto para Cloudinary */}
          <CldUploadButton
            signatureEndpoint="/api/sign-image"
            options={{ folder: "avatars" }} // opcional: pasta no Cloudinary
            onSuccess={(result) => {
              if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
                console.log("Imagem enviada:", result.info.secure_url)
                handleUpload(result.info.secure_url as string) // função que salva no banco
              } else {
                console.error("Upload result missing secure_url")
                toast.error("Erro no upload: URL da imagem não encontrada")
              }
            }}
          >
            <Button type="button" variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Alterar Avatar
            </Button>
          </CldUploadButton>
          {previewUrl && (
            <Button type="button" variant="outline" size="sm" onClick={handleRemoveAvatar}>
              <X className="mr-2 h-4 w-4" />
              Remover
            </Button>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">Upload direto no Cloudinary. Formatos aceitos: JPG, PNG, GIF.</p>
    </div>
  )
}
