interface Props {
  name: string;
  photoUrl: string;
  specialtyTags: string;
  location: string;
  selected: boolean;
  onSelect: () => void;
}

export default function TailorCard({
  name,
  photoUrl,
  specialtyTags,
  location,
  selected,
  onSelect,
}: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`text-left rounded-xl border overflow-hidden transition-colors ${
        selected ? "border-stone-900 ring-2 ring-stone-900" : "border-stone-200 hover:border-stone-400"
      }`}
    >
      <div className="aspect-square bg-stone-100">
        {photoUrl && photoUrl !== "PENDING_UPLOAD" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">
            {name}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium">{name}</h3>
        <p className="text-xs text-stone-500 mt-1">{specialtyTags}</p>
        <p className="text-xs text-stone-400 mt-1">{location}</p>
      </div>
    </button>
  );
}
