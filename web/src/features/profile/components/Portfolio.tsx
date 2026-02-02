import { useState } from 'react';

export default function Portfolio() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const items = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    title: `Project ${i + 1}`,
    desc: "CFD/thermal analysis deliverable",
    img: `https://picsum.photos/seed/cfd-${i}/600/400`,
    details: `Detailed description of Project ${i + 1} including methodology, tools used, and results achieved.`
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
        <span className="text-sm text-gray-500">{items.length} projects</span>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <div
            key={it.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => setExpandedId(expandedId === it.id ? null : it.id)}
          >
            <div className="relative">
              <img
                src={it.img}
                alt={it.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                CFD
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {it.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{it.desc}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  →
                </button>
              </div>
              
              {expandedId === it.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-700">{it.details}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded">
                      ANSYS
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded">
                      Thermal
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}