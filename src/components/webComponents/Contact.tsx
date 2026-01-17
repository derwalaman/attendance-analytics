"use client";

import {
    Mail,
    Instagram,
    Github,
    Linkedin,
    MessageCircle,
    MapPin,
    Sparkles,
} from "lucide-react";

export default function ContactPage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-background px-4 sm:px-6 lg:px-10 py-16 sm:py-20">

            {/* ================= HERO ================= */}
            <div className="relative max-w-6xl mx-auto text-center space-y-5">

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-muted text-xs sm:text-sm">
                    <Sparkles size={16} />
                    Contact & Support
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight">
                    Let’s <span className="text-primary">Connect</span>
                </h1>

                <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed">
                    Questions, feedback, feature ideas or collaboration —
                    <br className="hidden sm:block" />
                    feel free to reach out anytime.
                </p>
            </div>

            {/* ================= CONTACT GRID ================= */}
            <div
                className="
          relative max-w-6xl mx-auto mt-14 sm:mt-20
          grid gap-6 sm:gap-8
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
        "
            >
                <ContactCard
                    icon={<Mail />}
                    title="Email"
                    value="amanderwal02@gmail.com"
                    link="mailto:amanderwal02@gmail.com"
                    gradient="from-red-500 to-orange-400"
                />

                <ContactCard
                    icon={<MessageCircle />}
                    title="WhatsApp"
                    value="+91 8238790204"
                    link="https://wa.me/918238790204"
                    gradient="from-green-500 to-emerald-400"
                />

                <ContactCard
                    icon={<Instagram />}
                    title="Instagram"
                    value="@amanderwal02"
                    link="https://instagram.com/amanderwal02"
                    gradient="from-pink-500 to-purple-500"
                />

                <ContactCard
                    icon={<Github />}
                    title="GitHub"
                    value="github.com/derwalaman"
                    link="https://github.com/derwalaman"
                    gradient="from-gray-700 to-gray-500"
                />

                <ContactCard
                    icon={<Linkedin />}
                    title="LinkedIn"
                    value="linkedin.com/in/amanderwal"
                    link="https://linkedin.com/in/amanderwal"
                    gradient="from-blue-600 to-sky-500"
                />

                <ContactCard
                    icon={<MapPin />}
                    title="Location"
                    value="NIT Delhi, India"
                    link="https://maps.google.com?q=Nit Delhi"
                    gradient="from-orange-500 to-yellow-400"
                />
            </div>

            {/* ================= FOOTER CTA ================= */}
            <div className="relative max-w-4xl mx-auto mt-16 sm:mt-24 text-center space-y-3">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                    Let’s build something impactful 🚀
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                    I usually reply within 24 hours.
                </p>
            </div>
        </div>
    );
}

/* ================= CONTACT CARD ================= */

function ContactCard({
    icon,
    title,
    value,
    link,
    gradient,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
    link: string;
    gradient: string;
}) {
    return (
        <a
            href={link}
            target="_blank"
            className="
        group relative overflow-hidden
        rounded-3xl border
        bg-background/70 backdrop-blur-xl
        p-6 sm:p-7
        transition-all duration-300
        hover:-translate-y-2 hover:shadow-2xl
        active:scale-[0.98]
      "
        >
            {/* glow layer */}
            <div
                className={`
          absolute inset-0 opacity-0 group-hover:opacity-100
          transition duration-300
          bg-gradient-to-br ${gradient} blur-xl
        `}
            />

            <div className="relative z-10 space-y-4 sm:space-y-5">

                {/* icon */}
                <div
                    className={`
            w-12 h-12 sm:w-14 sm:h-14
            rounded-2xl flex items-center justify-center
            bg-gradient-to-br ${gradient} text-white
            shadow-lg
            group-hover:scale-110 transition
          `}
                >
                    {icon}
                </div>

                {/* content */}
                <div>
                    <h3 className="text-lg sm:text-xl font-semibold">
                        {title}
                    </h3>
                    <p className="mt-1 text-muted-foreground text-xs sm:text-sm break-all">
                        {value}
                    </p>
                </div>

                <span className="inline-block text-sm font-medium text-primary">
                    Contact →
                </span>
            </div>
        </a>
    );
}
