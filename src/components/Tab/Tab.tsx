import type { TabOption } from "@/interface/ITabOption";

export default function Tab({
  option,
  handleChangeStatus,
  status,
}: {
  option: TabOption;
  handleChangeStatus: React.Dispatch<React.SetStateAction<string>>;
  status: string;
}) {
  return (
    <button
      className={`px-3 py-2 bg-white text-black/80 rounded-md cursor-pointer whitespace-nowrap ${option.value === status ? "border-[1.5px] border-[#F05000]" : ""}`}
      onClick={() => handleChangeStatus(option.value)}
    >
      <h6>{option.title}</h6>
    </button>
  );
}
