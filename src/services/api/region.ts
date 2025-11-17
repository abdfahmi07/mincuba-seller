import axios from "axios";

const API_BASE_URL_WILAYAH = import.meta.env.VITE_API_BASE_URL_WILAYAH;

export const fetchProvinces = async () => {
  const { data } = await axios.get(`${API_BASE_URL_WILAYAH}/wilayah/province`);

  return data.data;
};

export const fetchCities = async (provinceCode: string = "") => {
  const { data } = await axios.get(`${API_BASE_URL_WILAYAH}/wilayah/city`, {
    params: {
      code: provinceCode,
    },
  });

  return data.data;
};

export const fetchDistricts = async (cityCode: string = "") => {
  const { data } = await axios.get(`${API_BASE_URL_WILAYAH}/wilayah/district`, {
    params: {
      code: cityCode,
    },
  });

  return data.data;
};

export const fetchSubDistricts = async (districtCode: string = "") => {
  const { data } = await axios.get(
    `${API_BASE_URL_WILAYAH}/wilayah/subdistrict`,
    {
      params: {
        code: districtCode,
      },
    }
  );

  return data.data;
};

export const fetchPostalCode = async (subDistrictCode: string = "") => {
  const { data } = await axios.get(
    `${API_BASE_URL_WILAYAH}/wilayah/postalcode`,
    {
      params: {
        code: subDistrictCode,
      },
    }
  );

  return data.data;
};
