import type { Card } from "./timeslot-card";

export function UnresolvedPanel({ cards }: { cards: Card[] }) {
  const unresolved = cards.filter((card) => !card.isResolved && card.lastMessage.trim().length > 0);

  return (
    <section className="rounded-xl border bg-white p-4">
      <h3 className="text-lg font-semibold">Pendientes sin resolver</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {unresolved.length === 0 ? (
          <li className="text-slate-500">No hay novedades pendientes.</li>
        ) : (
          unresolved.map((item) => (
            <li key={item.id} className="rounded border bg-slate-50 p-2">
              <strong>{item.startTime} - {item.endTime}</strong>: {item.lastMessage}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
