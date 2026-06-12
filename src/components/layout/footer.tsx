import Link from "next/link";
import { Globe, Link2, Mail, MapPin, Phone, Share2 } from "lucide-react";
import { ContactUsButton } from "@/components/ui/contact-us-button";
import { Logo } from "@/components/ui/logo";
import { COMPANY, FOOTER_LINKS } from "@/lib/constants";

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

const SOCIAL = [
  {
    icon: TelegramIcon,
    href: COMPANY.telegram,
    label: `Telegram ${COMPANY.telegramHandle}`,
    external: true,
  },
  { icon: Link2, href: "#", label: "LinkedIn", external: false },
  { icon: Globe, href: "#", label: "Website", external: false },
  { icon: Share2, href: "#", label: "Share", external: false },
] as const;

export function Footer() {
  return (
    <footer className="overflow-x-clip border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="#home" className="inline-flex">
              <Logo width={240} height={88} className="h-16 w-auto sm:h-[4.5rem]" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
              {COMPANY.tagline}. Enterprise trucking outsourcing for US motor
              carriers — compliance, dispatch, accounting, and more.
            </p>
            <a
              href={COMPANY.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-orange-600"
            >
              <TelegramIcon className="size-4 text-orange-600" />
              <span>
                Telegram:{" "}
                <span className="text-orange-600">{COMPANY.telegramHandle}</span>
              </span>
            </a>
            <div className="mt-4 flex gap-3">
              {SOCIAL.map(({ icon: Icon, href, label, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
            <ContactUsButton className="mt-6" />
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-slate-900">
              Services
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.services.map((item) => (
                <li key={item}>
                  <Link
                    href="#services"
                    className="text-sm text-slate-600 transition-colors hover:text-orange-600"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-slate-900">
              Products
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.products.map((item) => (
                <li key={item}>
                  <Link
                    href="#services"
                    className="text-sm text-slate-600 transition-colors hover:text-orange-600"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-slate-900">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.support.map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Contact Us" ? "#contact" : "#"}
                    className="text-sm text-slate-600 transition-colors hover:text-orange-600"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-8 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-orange-600" />
                {COMPANY.address}
              </li>
              <li className="flex min-w-0 items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-orange-600" />
                <a
                  href={`tel:+1${COMPANY.phone.replace(/\D/g, "")}`}
                  className="min-w-0 break-words hover:text-orange-600"
                >
                  {COMPANY.phone}
                </a>
              </li>
              <li className="flex min-w-0 items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-orange-600" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="min-w-0 break-all hover:text-orange-600"
                >
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex min-w-0 items-start gap-2">
                <TelegramIcon className="size-4 shrink-0 text-orange-600" />
                <a
                  href={COMPANY.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-600"
                >
                  {COMPANY.telegramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-center text-sm text-slate-500 sm:text-left">
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="#" className="hover:text-orange-600">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-orange-600">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
