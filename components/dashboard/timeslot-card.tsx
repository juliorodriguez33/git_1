"use client";

import { useState, useTransition } from "react";
import { TrafficLightSelector } from "./traffic-light-selector";
import { updateCardAction } from "@/actions/cards";

export type Card = {
  id: string;
  startTime: string;
  endTime: string;
  statusLight: "red" | "yellow" | "green";
  isResolved: boolean;
  lastMessage: string;
};

const bgByLight = {
  red: "bg-red-100",
  yellow: "bg-yellow-100",
  green: "bg-emerald-100"
};

export function TimeslotCard({ card }: { card: Card }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState(card.lastMessage);
  const [light, setLight] = useState(card.statusLight);
  const [resolved, setResolved] = useState(card.isResolved);

  function save() {
    startTransition(async () => {
      await updateCardAction({
        id: card.id,
        lastMessage: message,
        statusLight: light,
        isResolved: resolved
      });
    });
  }

  return (
    <article className={`rounded-xl border p-3 shadow-sm ${bgByLight[light]}`}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium">{card.startTime} - {card.endTime}</h3>
        <TrafficLightSelector value={light} onChange={setLight} />
      </div>
      <textarea
        className="min-h-24 w-full rounded border p-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe novedades..."
      />
      <div className="mt-2 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={resolved} onChange={(e) => setResolved(e.target.checked)} />
          Marcar como resuelto
        </label>
        <button
          onClick={save}
          disabled={pending}
          className="rounded bg-slate-900 px-3 py-1 text-sm text-white disabled:opacity-60"
        >
          {pending ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </article>
  );
}
