import Link from "next/link";
import { ANIMAL_TYPE_LABELS, ageLabel } from "../lib/labels";

export default function AnimalCard({ animal }) {
  return (
    <Link
      href={`/animaux/${animal.id}`}
      className="card group flex flex-col overflow-hidden transition hover:shadow-md"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-beige text-sm text-green-dark/40">
        {animal.mainPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={animal.mainPhotoUrl} alt={animal.name} className="h-full w-full object-cover" />
        ) : (
          "photo"
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="truncate font-semibold text-green-dark">{animal.name}</p>
        <span className="badge w-fit border border-green/20 bg-ivory text-green-dark">
          {ANIMAL_TYPE_LABELS[animal.type]?.toLowerCase()} · {ageLabel(animal.ageYears, animal.ageMonths)}
        </span>
      </div>
    </Link>
  );
}
