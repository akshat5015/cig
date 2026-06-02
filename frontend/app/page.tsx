import Link from "next/link";
import GlassCard from "@/components/GlassCard";

const features = [
  {
    title: "Event Albums",
    desc: "Organize photos and videos by event with categories and access control.",
  },
  {
    title: "AI Search & Tags",
    desc: "Smart tagging and search by event, tags, date, and uploader.",
  },
  {
    title: "Find Your Photos",
    desc: "Upload a selfie and discover every shot you appear in.",
  },
  {
    title: "Social & Real-time",
    desc: "Like, comment, favorite, and get notified when someone interacts.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-16">
      <section className="mb-20 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-[#5eead4]">
          Event & Media Management
        </p>
        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          Every moment.
          <br />
          <span className="bg-gradient-to-r from-[#7c9cff] to-[#5eead4] bg-clip-text text-transparent">
            One place.
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-lg text-white/60">
          EventSphere helps clubs and photographers upload, organize, and share
          event media — with AI tagging, facial recognition, and social features.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/events" className="btn-primary rounded-xl px-8 py-3 text-base">
            Explore Events
          </Link>
          <Link href="/signup" className="btn-ghost rounded-xl px-8 py-3 text-base">
            Get Started
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <GlassCard key={f.title} className="text-left">
            <h3 className="mb-2 font-semibold">{f.title}</h3>
            <p className="text-sm text-white/55">{f.desc}</p>
          </GlassCard>
        ))}
      </section>
    </div>
  );
}
