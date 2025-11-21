export default function Tab({ title }: { title: string }) {
  return (
    <button className="px-3 py-2 bg-white text-black/80 rounded-md">
      <h6>{title}</h6>
    </button>
  );
}
