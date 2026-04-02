import type { Resource } from "@/lib/types";

const accentBar: Record<Resource["accent"], string> = {
  blue: "bg-blue-600",
  purple: "bg-purple-600",
  green: "bg-green-600",
  orange: "bg-orange-500",
};

const iconWrap: Record<Resource["accent"], string> = {
  blue: "bg-blue-50",
  purple: "bg-purple-50",
  green: "bg-green-50",
  orange: "bg-orange-50",
};

const iconColor: Record<Resource["accent"], string> = {
  blue: "text-blue-600",
  purple: "text-purple-600",
  green: "text-green-600",
  orange: "text-orange-500",
};

function ResourceGlyph({ resource }: { resource: Resource }) {
  const cls = `${iconWrap[resource.accent]} rounded-lg flex items-center justify-center w-10 h-10`;
  const stroke = iconColor[resource.accent];
  if (resource.icon === "building") {
    return (
      <div className={cls}>
        <svg
          className={`w-5 h-5 ${stroke}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"
          />
        </svg>
      </div>
    );
  }
  if (resource.icon === "lab") {
    return (
      <div className={cls}>
        <svg
          className={`w-5 h-5 ${stroke}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }
  if (resource.icon === "meeting") {
    return (
      <div className={cls}>
        <svg
          className={`w-5 h-5 ${stroke}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
          />
        </svg>
      </div>
    );
  }
  if (resource.icon === "projector") {
    return (
      <div className={cls}>
        <svg
          className={`w-5 h-5 ${stroke}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }
  return (
    <div className={cls}>
      <svg
        className={`w-5 h-5 ${stroke}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </div>
  );
}

export function ResourceCard({ resource }: { resource: Resource }) {
  const statusClass =
    resource.status === "ACTIVE"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-600";

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer">
      <div className={`h-2 ${accentBar[resource.accent]}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <ResourceGlyph resource={resource} />
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusClass}`}
          >
            {resource.status === "ACTIVE" ? "ACTIVE" : "OUT_OF_SERVICE"}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900">{resource.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{resource.location}</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
          <span>{resource.type}</span>
          <span>&bull;</span>
          <span>{resource.capacityLabel}</span>
        </div>
      </div>
    </div>
  );
}
