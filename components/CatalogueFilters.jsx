"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TYPES = [
  { value: "TOUS", label: "Tous" },
  { value: "CHIEN", label: "Chiens" },
  { value: "CHAT", label: "Chats" },
  { value: "AUTRE", label: "Autres" },
];

export default function CatalogueFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const type = params.get("type") || "TOUS";
  const enfants = params.get("enfants") === "OUI";
  const chats = params.get("chats") === "OUI";
  const chiens = params.get("chiens") === "OUI";

  function update(next) {
    const sp = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v === null || v === false || v === "TOUS") sp.delete(k);
      else sp.set(k, v === true ? "OUI" : v);
    });
    router.push(`/animaux?${sp.toString()}`);
  }

  return (
    <div className="card h-fit p-5">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-green-dark/50">Filtrer par type</p>
      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => update({ type: t.value })}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              type === t.value
                ? "border-green bg-green text-white"
                : "border-black/10 bg-white text-green-dark hover:border-green/40"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="my-4 border-t border-black/5" />

      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-green-dark/50">Compatibilité</p>
      <div className="space-y-2 text-sm text-green-dark">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={enfants} onChange={(e) => update({ enfants: e.target.checked })} />
          Ok avec les enfants
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={chats} onChange={(e) => update({ chats: e.target.checked })} />
          Ok avec les chats
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={chiens} onChange={(e) => update({ chiens: e.target.checked })} />
          Ok avec les chiens
        </label>
      </div>

      <button
        onClick={() => router.push("/animaux")}
        className="mt-5 w-full rounded-lg border border-black/10 py-2 text-sm font-medium text-green-dark hover:bg-beige"
      >
        Réinitialiser
      </button>
    </div>
  );
}
