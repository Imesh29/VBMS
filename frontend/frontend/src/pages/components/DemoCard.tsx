interface DemoCardProps {
  title: string;
  email: string;
  password: string;
  color: "blue" | "purple" | "red";
}

export default function DemoCard({
  title,
  email,
  password,
  color,
}: DemoCardProps) {

  const colors = {
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

      <div className="flex justify-between items-center">

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[color]}`}
        >
          {title}
        </span>

      </div>

      <div className="mt-4 text-sm text-gray-600">

        <p>
          <strong>Email:</strong> {email}
        </p>

        <p className="mt-1">
          <strong>Password:</strong> {password}
        </p>

      </div>

    </div>
  );
}