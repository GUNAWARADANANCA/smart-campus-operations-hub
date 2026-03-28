type StatsCardVariant = "resources" | "pending" | "tickets" | "users";

type StatsCardProps = {
  variant: StatsCardVariant;
  label: string;
  value: string | number;
  hint: string;
  hintClassName: string;
};

function StatIcon({ variant }: { variant: StatsCardVariant }) {
  if (variant === "resources") {
    return (
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"
          />
        </svg>
      </div>
    );
  }
  if (variant === "pending") {
    return (
      <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
        <svg
          className="w-6 h-6 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }
  if (variant === "tickets") {
    return (
      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
        <svg
          className="w-6 h-6 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
      <svg
        className="w-6 h-6 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"
        />
      </svg>
    </div>
  );
}

export function StatsCard({
  variant,
  label,
  value,
  hint,
  hintClassName,
}: StatsCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className={`text-xs mt-1 ${hintClassName}`}>{hint}</p>
        </div>
        <StatIcon variant={variant} />
      </div>
    </div>
  );
}
