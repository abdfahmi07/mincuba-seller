import type { Region } from "@/interface/IRegion";

export const formatRegionForSelectOption = (data: Region[]) => {
  return data.map((item: Region) => ({
    label: item.nama,
    value: item.code,
  }));
};
