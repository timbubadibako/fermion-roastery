import React from "react";

interface FermionPlaceholderPanelProps {
  color?: "blue" | "lilac" | "yellow" | "coral" | "dark";
  text?: string;
  icon?: React.ReactNode;
  className?: string;
}

const colorClasses = {
  blue: "bg-fermion-blue/10 border-fermion-blue/20 text-fermion-blue",
  lilac: "bg-fermion-lilac/10 border-fermion-lilac/20 text-fermion-lilac",
  yellow: "bg-fermion-yellow/10 border-fermion-yellow/20 text-fermion-yellow",
  coral: "bg-fermion-coral/10 border-fermion-coral/20 text-fermion-coral",
  dark: "bg-fermion-charcoal/10 border-fermion-charcoal/20 text-fermion-charcoal",
};

export function FermionPlaceholderPanel({
  color = "blue",
  text = "Image Placeholder",
  icon,
  className = "",
}: FermionPlaceholderPanelProps) {
  const colorClass = colorClasses[color];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-8 ${colorClass} ${className}`}
    >
      {icon && <div className="text-4xl">{icon}</div>}
      <p className="text-center text-sm font-bold uppercase tracking-widest">
        {text}
      </p>
    </div>
  );
}
