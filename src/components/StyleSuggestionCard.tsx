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
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`text-left rounded-xl border overflow-hidden bg-white/50 transition-colors ${
        selected
          ? "border-espresso ring-2 ring-espresso"
          : "border-taupe/25 hover:border-dusty-rose"
      }`}
    >
      <div className="aspect-[3/4] bg-blush/40">
        {imageUrl && imageUrl !== "PENDING_UPLOAD" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-espresso-muted text-sm px-2 text-center">
            {name}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-espresso">{name}</h3>
        <p className="text-xs text-espresso-muted mt-1">{reason}</p>
        <div className="mt-2 text-sm text-espresso">
          <p>{yardsNeeded} yards</p>
          <p className="font-medium">₦{totalPrice.toLocaleString()}</p>
        </div>
      </div>
    </button>
  );
}
