"use client";

import { Button } from "@/components/ui/button";
import { useContactModal } from "@/components/providers/contact-modal-provider";
import { cn } from "@/lib/utils";

type ContactUsButtonProps = {
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "default" | "lg";
  onClick?: () => void;
};

export function ContactUsButton({
  children = "Contact Us",
  className,
  variant = "primary",
  size = "default",
  onClick,
}: ContactUsButtonProps) {
  const { openModal } = useContactModal();

  const handleClick = () => {
    onClick?.();
    openModal();
  };

  const variants = {
    primary:
      "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/25 hover:from-orange-500 hover:to-orange-300",
    outline:
      "border-orange-500/40 bg-white/5 text-orange-600 hover:border-orange-500 hover:bg-orange-50",
    ghost: "text-orange-600 hover:bg-orange-50",
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      className={cn(
        "rounded-xl font-semibold transition-all",
        size === "lg" && "h-12 px-8 text-base",
        size === "default" && "h-10 px-6",
        variants[variant],
        className
      )}
    >
      {children}
    </Button>
  );
}
