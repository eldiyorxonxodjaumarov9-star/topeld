import Link from "next/link";
import { Globe, Link2, Mail, MapPin, MessageCircle, Phone, Share2 } from "lucide-react";
import { ContactUsButton } from "@/components/ui/contact-us-button";
import { Logo } from "@/components/ui/logo";
import { COMPANY, FOOTER_LINKS } from "@/lib/constants";

const SOCIAL = [
  { icon: Link2, href: "#", label: "LinkedIn" },
  { icon: Globe, href: "#", label: "Website" },
  { icon: Share2, href: "#", label: "Share" },
  { icon: MessageCircle, href: "#", label: "Messages" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
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
            <div className="mt-6 flex gap-3">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
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
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-orange-600" />
                <a href="tel:+18005553531" className="hover:text-orange-600">
                  {COMPANY.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-orange-600" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="hover:text-orange-600"
                >
                  {COMPANY.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
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
