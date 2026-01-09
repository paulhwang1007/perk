import { cn } from "@/lib/utils";

interface CreditCardVisualProps {
  cardName: string;
  gradient?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CreditCardVisual({
  cardName,
  gradient = "from-slate-600 to-slate-800",
  size = "md",
  className,
}: CreditCardVisualProps) {
  const sizeClasses = {
    sm: "w-20 h-[50px]",
    md: "w-40 h-[100px]",
    lg: "w-64 h-[160px]",
  };

  const textSizes = {
    sm: "text-[6px]",
    md: "text-[10px]",
    lg: "text-sm",
  };

  const chipSizes = {
    sm: "w-4 h-3",
    md: "w-7 h-5",
    lg: "w-10 h-7",
  };

  const issuer = getIssuer(cardName);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-gradient-to-br p-3 shadow-lg",
        gradient,
        sizeClasses[size],
        className
      )}
      style={{
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 100% 0%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
        }}
      />

      {/* Chip */}
      <div
        className={cn(
          "rounded-sm bg-gradient-to-br from-amber-300 to-amber-500",
          chipSizes[size]
        )}
        style={{
          boxShadow: "inset 0 1px 2px rgba(255,255,255,0.3)",
        }}
      />

      {/* Card Name - bottom */}
      <div className="absolute bottom-2 left-3 right-3">
        <p
          className={cn(
            "font-medium text-white/90 truncate",
            textSizes[size]
          )}
        >
          {cardName}
        </p>
      </div>

      {/* Network logo placeholder - bottom right */}
      <div className="absolute bottom-2 right-3">
        <span
          className={cn(
            "font-semibold text-white/60 uppercase tracking-wider",
            textSizes[size]
          )}
        >
          {issuer}
        </span>
      </div>
    </div>
  );
}

function getIssuer(cardName: string): string {
  const name = cardName.toLowerCase();
  if (name.includes("chase")) return "VISA";
  if (name.includes("amex") || name.includes("american express")) return "AMEX";
  if (name.includes("citi")) return "MC";
  if (name.includes("discover")) return "DISC";
  if (name.includes("capital one")) return "MC";
  return "VISA";
}
