import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "paper" | "accent" | "ghost";

const tones: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  paper: "bg-card text-foreground",
  accent: "bg-accent text-accent-foreground",
  ghost: "bg-transparent text-foreground border-foreground/30 shadow-none",
};

export const PressButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone }
>(function PressButton({ className, tone = "paper", ...props }, ref) {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        "btn-physical active:translate-y-[3px] active:shadow-none hover:brightness-[1.03]",
        tones[tone],
        className,
      )}
    />
  );
});
