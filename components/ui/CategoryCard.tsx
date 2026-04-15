import Link from "next/link";

type CategoryCardProps = {
  title: string;
  image: string;
  href: string;
};

export default function CategoryCard({
  title,
  image,
  href,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-[28px] border border-[#ead9d1] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/5] overflow-hidden md:aspect-[5/4]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/12 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-white/80">
            Collection
          </p>
          <h3 className="text-2xl font-semibold leading-tight">{title}</h3>
          <p className="mt-2 text-sm text-white/90">Explore now</p>
        </div>
      </div>
    </Link>
  );
}