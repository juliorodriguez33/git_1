import { TimeslotCard, type Card } from "./timeslot-card";

export function DailyGrid({ cards }: { cards: Card[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <TimeslotCard key={card.id} card={card} />
      ))}
    </section>
  );
}
