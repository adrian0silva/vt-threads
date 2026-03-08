"use client";

import { Eye, Users } from "lucide-react";
import { useEffect, useState } from "react";

type OnlineData = {
  total: number;
  logged: number;
  guests: number;
};

export function OnlineStats() {
  const [data, setData] = useState<OnlineData | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/online", { cache: "no-store" });
      setData(await res.json());
    };

    load();

    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <>
        <div className="flex justify-between">
          <dt className="text-muted-foreground flex items-center gap-1">
            <Users className="h-4 w-4" />
            Usuários Online:
          </dt>
          <dd className="font-bold text-foreground">0</dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-muted-foreground flex items-center gap-1">
            <Eye className="h-4 w-4" />
            Visitantes:
          </dt>
          <dd className="font-bold text-foreground">0</dd>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between">
        <dt className="text-muted-foreground flex items-center gap-1">
          <Users className="h-4 w-4" />
          Usuários Online:
        </dt>
        <dd className="font-bold text-foreground">{data.logged}</dd>
      </div>

      <div className="flex justify-between">
        <dt className="text-muted-foreground flex items-center gap-1">
          <Eye className="h-4 w-4" />
          Visitantes:
        </dt>
        <dd className="font-bold text-foreground">{data.guests}</dd>
      </div>
    </>
  );
}
