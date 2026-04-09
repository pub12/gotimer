import { Info, Lightbulb, TriangleAlert } from "lucide-react";

interface CalloutProps {
  type?: "tip" | "warning" | "info";
  children: React.ReactNode;
}

const config = {
  tip: {
    icon: Lightbulb,
    className: "bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100",
    iconClassName: "text-green-600 dark:text-green-400",
    label: "Tip",
  },
  warning: {
    icon: TriangleAlert,
    className: "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-100",
    iconClassName: "text-amber-600 dark:text-amber-400",
    label: "Warning",
  },
  info: {
    icon: Info,
    className: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100",
    iconClassName: "text-blue-600 dark:text-blue-400",
    label: "Info",
  },
};

export function Callout({ type = "info", children }: CalloutProps) {
  const { icon: Icon, className, iconClassName, label } = config[type];

  return (
    <div className={`my-6 flex gap-3 rounded-lg border p-4 ${className}`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconClassName}`} aria-label={label} />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
