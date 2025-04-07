export const AssigneeAvatar = ({ name }) => {
  if (!name) return null;

  const firstLetter = name.charAt(0).toUpperCase();
  const bgColor = getColorForLetter(name);

  return (
    <div className="relative group">
      <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-semibold ${bgColor}`}>
        {firstLetter}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-10 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-md">
        {name}
      </div>
    </div>
  );
};

export const getColorForLetter = (name) => {
  if (!name) return "bg-gray-500";

  const firstLetter = name.charAt(0).toLowerCase();
  const colorMap = {
    a: "bg-red-500", b: "bg-blue-500", c: "bg-green-500", d: "bg-yellow-500",
    e: "bg-purple-500", f: "bg-indigo-500", g: "bg-pink-500", h: "bg-teal-500",
    i: "bg-orange-500", j: "bg-lime-500", k: "bg-amber-500", l: "bg-emerald-500",
    m: "bg-cyan-500", n: "bg-rose-500", o: "bg-sky-500", p: "bg-violet-500",
    q: "bg-gray-500", r: "bg-red-600", s: "bg-blue-600", t: "bg-green-600",
    u: "bg-yellow-600", v: "bg-purple-600", w: "bg-indigo-600", x: "bg-pink-600",
    y: "bg-teal-600", z: "bg-orange-600"
  };

  return colorMap[firstLetter] || "bg-gray-500";
};
