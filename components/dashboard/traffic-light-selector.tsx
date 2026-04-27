"use client";

import { AlertTriangle, CircleCheck, OctagonAlert } from "lucide-react";

type Light = "red" | "yellow" | "green";

const styles: Record<Light, string> = {
  red: "bg-red-600 text-white",
  yellow: "bg-yellow-400 text-black",
  green: "bg-emerald-600 text-white"
};

export function TrafficLightSelector({
  value,
  onChange
}: {
  value: Light;
  onChange: (light: Light) => void;
}) {
  return (
    <div className="flex gap-2">
      <button className={`rounded-md px-2 py-1 ${styles.red}`} onClick={() => onChange("red")}>
        <OctagonAlert className="h-4 w-4" />
      </button>
      <button className={`rounded-md px-2 py-1 ${styles.yellow}`} onClick={() => onChange("yellow")}>
        <AlertTriangle className="h-4 w-4" />
      </button>
      <button className={`rounded-md px-2 py-1 ${styles.green}`} onClick={() => onChange("green")}>
        <CircleCheck className="h-4 w-4" />
      </button>
    </div>
  );
}
