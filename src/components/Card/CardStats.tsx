import type { CardStats } from "@/interface/ICardStats";
import CountUp from "react-countup";

export default function CardStats({ stats }: CardStats) {
  return (
    <div className="border border-[#E9E9E9] rounded-2xl bg-white hover:bg-[#f7f7f7] transition-colors p-5 flex flex-col gap-y-2 cursor-pointer">
      <div className="flex gap-x-2 items-center">
        <div className="w-7 h-7 bg-[#F05000] rounded-full flex justify-center items-center">
          <img className="w-4" src={stats.icon} alt="" />
        </div>

        <CountUp
          start={0}
          end={parseInt(stats.amount)}
          separator="."
          className="text-3xl font-semibold text-black/50"
          delay={0}
        />
        {/* <h3 className="text-3xl font-semibold text-black/50">{stats.amount}</h3> */}
      </div>
      <div className="flex flex-col">
        <h5 className="text-sm text-black/50 font-semibold">
          {stats.category}
        </h5>
        <p className="text-xs text-black/30 font-medium">{stats.timeLabel}</p>
      </div>
    </div>
  );
}
