"use client";

import { Badge } from "@/src/app/_components/ui/badge";
import { Thread } from "@/src/app/generated/prisma";
import { ColumnDef } from "@tanstack/react-table";
import { CircleIcon } from "lucide-react";


export const threadsTableColumn: ColumnDef<Thread>[] = [
  {
    accessorKey: "name",
    header: "Produto",
  },
  {
    accessorKey: "price",
    header: "Valor unitário",
  },
  {
    accessorKey: "stock",
    header: "Estoque",
  },
];
