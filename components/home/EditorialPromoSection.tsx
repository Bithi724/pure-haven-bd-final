import Link from "next/link";

type PromoCardProps = {
  title: string;
  subtitle?: string;
  href: string;
  image: string;
  className?: string;
  dark?: boolean;
};

function PromoCard({
  title,
  subtitle,
  href,
  image,
  className = "",
  dark = false,
}: PromoCardProps) {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-[20px] border border-[#ead9d1] bg-white shadow-[0_6px_18px_rgba(46,34,29,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(46,34,29,0.10)] ${className}`}
    >
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.03]"
      />

      <div
        className={`absolute inset-0 ${
          dark
            ? "bg-gradient-to-t from-black/72 via-black/18 to-transparent"
            : "bg-gradient-to-t from-black/52 via-black/10 to-transparent"
        }`}
      />

      <div className="absolute inset-x-0 bottom-0 p-2.5 text-white sm:p-3 lg:p-4">
        {subtitle ? (
          <p className="mb-1 text-[8px] font-medium uppercase tracking-[0.16em] text-white/80 sm:text-[9px] lg:text-[10px]">
            {subtitle}
          </p>
        ) : null}

        <h3 className="max-w-[90%] text-[0.95rem] font-semibold leading-tight sm:text-[1.05rem] lg:text-[1.25rem]">
          {title}
        </h3>

        <p className="mt-1 text-[10px] font-medium text-white/90 sm:text-[11px] lg:text-xs">
          Explore now
        </p>
      </div>
    </Link>
  );
}

export default function EditorialPromoSection() {
  return (
    <section className="section-gap relative z-0 overflow-hidden">
      <div className="container-ph">
        {/* Mobile */}
        <div className="grid grid-cols-1 gap-3 lg:hidden">
          <PromoCard
            title="New Arrivals"
            subtitle="Season Edit"
            href="/shop"
            image="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1800&auto=format&fit=crop"
            className="h-[190px] sm:h-[230px]"
          />

          <div className="grid grid-cols-2 gap-3">
            <PromoCard
              title="Top Picks"
              subtitle="Editor’s Choice"
              href="/shop"
              image="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1800&auto=format&fit=crop"
              className="col-span-2 h-[125px] sm:h-[150px]"
              dark
            />

            <PromoCard
              title="Inside Story"
              subtitle="Brand Edit"
              href="/shop"
              image="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1600&auto=format&fit=crop"
              className="h-[125px] sm:h-[150px]"
            />

            <PromoCard
              title="Monogram Edition"
              subtitle="Limited Drop"
              href="/shop"
              image="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop"
              className="h-[125px] sm:h-[150px]"
              dark
            />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden lg:grid lg:grid-cols-[1.08fr_0.92fr] lg:gap-4 xl:gap-5">
          <PromoCard
            title="New Arrivals"
            subtitle="Season Edit"
            href="/shop"
            image="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1800&auto=format&fit=crop"
            className="h-[420px] xl:h-[460px]"
          />

          <div className="grid gap-4 xl:gap-5">
            <PromoCard
              title="Top Picks"
              subtitle="Editor’s Choice"
              href="/shop"
              image="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1800&auto=format&fit=crop"
              className="h-[132px] xl:h-[145px]"
              dark
            />

            <PromoCard
              title="Inside Story"
              subtitle="Brand Edit"
              href="/shop"
              image="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1600&auto=format&fit=crop"
              className="h-[132px] xl:h-[145px]"
            />

            <PromoCard
              title="Monogram Edition"
              subtitle="Limited Drop"
              href="/shop"
              image="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop"
              className="h-[132px] xl:h-[145px]"
              dark
            />
          </div>
        </div>
      </div>
    </section>
  );
}