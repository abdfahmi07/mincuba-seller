import Tab from "../Tab/Tab";

export default function Tabs() {
  return (
    <div className="flex gap-x-2 mt-4 px-4 font-poppins text-sm w-full overflow-x-scroll hide-scrollbar">
      <Tab title="Semua" />
      <Tab title="Baru" />
      <Tab title="Diproses" />
      <Tab title="Dikirim" />
      <Tab title="Selesai" />
      <Tab title="Dibatalkan" />
    </div>
  );
}
