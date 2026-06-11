import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onDark?: boolean;
};

export function Logo({
  className,
  width = 320,
  height = 213,
  onDark = false,
}: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png?v=2"
      alt="TOP ELD SOLUTIONS INC"
      width={width}
      height={height}
      decoding="async"
      className={cn(
        "block w-auto object-contain object-left",
        onDark && "drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)]",
        className
      )}
    />
  );
}
