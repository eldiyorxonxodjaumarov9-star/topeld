"use client";

import {
  Calculator,
  ClipboardCheck,
  FileText,
  Headphones,
  Shield,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ServiceIcon } from "@/lib/constants";

const ICON_MAP: Record<ServiceIcon, LucideIcon> = {
  truck: Truck,
  shield: Shield,
  "file-text": FileText,
  "clipboard-check": ClipboardCheck,
  headphones: Headphones,
  calculator: Calculator,
  users: Users,
};

export function ServiceIcon({
  name,
  className,
}: {
  name: ServiceIcon;
  className?: string;
}) {
  const Icon = ICON_MAP[name];
  return <Icon className={className} strokeWidth={1.75} />;
}
