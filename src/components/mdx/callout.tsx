import { Info, Lightbulb, TriangleAlert } from "lucide-react";

interface CalloutProps {
  type?: "tip" | "warning" | "info";
  children: React.ReactNode;
}

const config = {
  tip: {
    icon: Lightbulb,
    className: "bg-surface-container-low text-foreground border-l-4 border-l-accent",
    iconClassName: "text-accent",
    label: "Tip",
  },
  warning: {
    icon: TriangleAlert,
    className: "bg-surface-container-low text-foreground border-l-4 border-l-secondary",
    iconClassName: "text-secondary",
    label: "Warning",
  },
  info: {
    icon: Info,
    className: "bg-surface-container-low text-foreground border-l-4 border-l-primary",
    iconClassName: "text-primary",
    label: "Info",
  },
};

export function Callout({ type = "info", children }: CalloutProps) {
  const { icon: Icon, className, iconClassName, label } = config[type];

  return (
    <div className={`my-6 flex gap-3 rounded-[0.75rem] p-4 ${className}`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconClassName}`} aria-label={label} />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
