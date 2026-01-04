import React from "react";
import ProfileLayout from "@/components/layout/ProfileLayout";

export default function Portfolio() {
  const items = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    title: `Project ${i + 1}`,
    desc: "CFD/thermal analysis deliverable",
    img: `https://picsum.photos/seed/cfd-${i}/600/400`,
  }));

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h1 className="text-xl text-gray-900 mb-4">Portfolio</h1>
        <div className="grid sm:grid-cols-2 gap-6">
          {items.map((it) => (
            <div
              key={it.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <img
                src={it.img}
                alt={it.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-gray-900">{it.title}</h3>
                <p className="text-sm text-gray-600">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
