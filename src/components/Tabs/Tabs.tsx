import type { TabOption } from "@/interface/ITabOption";
import Tab from "../Tab/Tab";

export default function Tabs({
  handleChangeStatus,
  status,
}: {
  handleChangeStatus: React.Dispatch<React.SetStateAction<string>>;
  status: string;
}) {
  const tabs = [
    { title: "Baru", value: "" },
    { title: "Diproses", value: "CONFIRM" },
    { title: "Telah Disiapkan", value: "READY_TO_PICKUP" },
    { title: "Dikirim", value: "DELIVERY" },
    { title: "Tiba di Tujuan", value: "DELIVERED" },
    { title: "Selesai", value: "COMPLETE" },
    { title: "Dibatalkan", value: "CANCEL" },
  ];
  return (
    <div className="flex gap-x-2 mt-4 px-4 font-poppins text-sm w-full overflow-x-scroll hide-scrollbar">
      {tabs.map((option: TabOption) => (
        <Tab
          option={option}
          handleChangeStatus={handleChangeStatus}
          status={status}
        />
      ))}
      {/* <Tab title="Semua" /> */}
    </div>
  );
}
