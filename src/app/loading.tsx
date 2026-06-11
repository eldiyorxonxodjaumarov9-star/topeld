import { Logo } from "@/components/ui/logo";
import { COMPANY } from "@/lib/constants";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <Logo width={320} height={120} priority className="h-20 w-auto sm:h-24" />
        <div className="size-10 animate-spin rounded-full border-2 border-orange-600 border-t-transparent" />
        <p className="font-brand-sans text-xs font-medium uppercase tracking-widest text-slate-500">
          Loading {COMPANY.shortName}...
        </p>
      </div>
    </div>
  );
}
