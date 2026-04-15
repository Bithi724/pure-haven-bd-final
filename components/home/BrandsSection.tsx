import { brands } from "@/lib/data";

export default function BrandsSection() {
  return (
    <section className="container-ph section-gap">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold">Top Brands</h2>
        <p className="text-neutral-600 mt-2">
          Trusted brands available in our store
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {brands.map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center rounded-[20px] border border-[#ead9d1] bg-white p-6"
          >
            <img
              src={logo}
              alt={`Brand ${index + 1}`}
              className="h-10 object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}