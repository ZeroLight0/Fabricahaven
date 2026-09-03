interface Props {
  name: string;
  imageUrl: string;
  reason: string;
  yardsNeeded: number;
  totalPrice: number;
  selected: boolean;
  onSelect: () => void;
}

export default function StyleSuggestionCard({
  name,
  imageUrl,
  reason,
  yardsNeeded,
  totalPrice,
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
      <div className="aspect-[3/4] bg-stone-100">
        {imageUrl && imageUrl !== "PENDING_UPLOAD" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">
            {name}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium">{name}</h3>
        <p className="text-xs text-stone-500 mt-1">{reason}</p>
        <div className="mt-2 text-sm">
          <p>{yardsNeeded} yards</p>
          <p className="font-medium">₦{totalPrice.toLocaleString()}</p>
        </div>
      </div>
    </button>
  );
}
