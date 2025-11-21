import { userStorage } from "@/helpers/userStorage";
import { ChevronRight, Edit2, LocateFixed, Minimize2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { getAddressFromLatLng, getCurrentLocation } from "@/helpers/location";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  fetchCities,
  fetchDistricts,
  fetchPostalCode,
  fetchProvinces,
  fetchSubDistricts,
} from "@/services/api/region";
import { formatRegionForSelectOption } from "@/helpers/selectOption";
import axios, { isAxiosError } from "axios";
import * as Yup from "yup";
import type { Option } from "@/interface/ISelectOption";
import type { PostalCode } from "@/interface/IRegion";
import "react-datepicker/dist/react-datepicker.css";
import "./style/index.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
// import type { FormStore } from "@/interface/IFormStore";
import { openStore } from "@/services/api/store";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const schemaValidationFormStore = Yup.object({
  name: Yup.string().required("Nama Toko wajib diisi"),
  phone: Yup.string()
    .required("Nomor HP wajib diisi")
    .matches(
      /^(\\+62|62|0)8[1-9][0-9]{6,12}$/,
      "Nomor HP tidak valid, gunakan format Indonesia"
    ),

  province: Yup.object({
    value: Yup.string(),
    label: Yup.string(),
  })
    .nullable()
    .test(
      "required-province",
      "Provinsi wajib dipilih",
      (v) => !!v && !!v.value
    ),

  city: Yup.object({
    value: Yup.string(),
    label: Yup.string(),
  })
    .nullable()
    .test("required-city", "Kota wajib dipilih", (v) => !!v && !!v.value),

  district: Yup.object({
    value: Yup.string(),
    label: Yup.string(),
  })
    .nullable()
    .test(
      "required-district",
      "Kecamatan wajib dipilih",
      (v) => !!v && !!v.value
    ),

  subDistrict: Yup.object({
    value: Yup.string(),
    label: Yup.string(),
  })
    .nullable()
    .test(
      "required-subDistrict",
      "Kelurahan wajib dipilih",
      (v) => !!v && !!v.value
    ),

  postalCode: Yup.string().required("Kode Pos wajib diisi"),
  detailAddress: Yup.string().required("Alamat Lengkap wajib diisi"),
  guide: Yup.string().required("Panduan toko wajib diisi"),
  description: Yup.string().required("Deskripsi singkat wajib diisi"),
});

type FormStore = Yup.InferType<typeof schemaValidationFormStore>;

export default function CreateStorePage() {
  const [isShowMapFullScreen, setIsShowMapFullScreen] =
    useState<boolean>(false);
  const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [currentAddress, setCurrentAddress] = useState<string | null>("");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [provinces, setProvinces] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const [subDistricts, setSubDistricts] = useState<Option[]>([]);
  const targetRef = useRef<google.maps.LatLngLiteral | null>(null);
  const animationFrame = useRef<number | null>(null);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentUser = userStorage.get();
  const navigate = useNavigate();

  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormStore>({
    resolver: yupResolver(schemaValidationFormStore),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      province: null,
      city: null,
      district: null,
      subDistrict: null,
      postalCode: "",
      detailAddress: "",
      guide: "",
      description: "",
    },
  });

  const province = watch("province");
  const city = watch("city");
  const district = watch("district");
  const subDistrict = watch("subDistrict");

  const containerStyle = {
    width: "100%",
    height: "250px",
    borderRadius: "0.75rem",
  };
  const center = { lat: -6.2, lng: 106.816666 };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_API_KEY_GOOGLE_MAP,
    libraries: ["places"],
  });

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const smoothMove = (
    from: google.maps.LatLngLiteral,
    to: google.maps.LatLngLiteral
  ) => {
    const duration = 600;
    const frames = 60;
    const step = 1000 / frames;
    const latStep = (to.lat - from.lat) / (duration / step);
    const lngStep = (to.lng - from.lng) / (duration / step);

    let currentLat = from.lat;
    let currentLng = from.lng;
    let elapsed = 0;

    setIsAnimating(true);

    const animate = () => {
      elapsed += step;
      currentLat += latStep;
      currentLng += lngStep;

      setPosition({ lat: currentLat, lng: currentLng });

      if (elapsed < duration) {
        animationFrame.current = requestAnimationFrame(animate);
      } else {
        setPosition(to);

        setIsAnimating(false);

        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
        }
      }
    };

    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    animationFrame.current = requestAnimationFrame(animate);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return previewUrl;
    });

    setAvatarFile(file);
  };

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const uploadImage = async (imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append("folder", "store");
      formData.append("app", "mincuba");
      formData.append("files", imageFile);

      const response = await axios.put(
        `${import.meta.env.VITE_API_MEDIA}/api/v1/media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.data[0].url;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error("Upload Gagal", {
          position: "top-center",
        });
        return;
      }

      toast.error("Terjadi kesalahan tak terduga", {
        position: "top-center",
      });
      return null;
    }
  };

  const handlePlaceChanged = async () => {
    if (!autoCompleteRef.current) return;
    const place = autoCompleteRef.current.getPlace();
    if (!place?.geometry) return;

    const location = place.geometry?.location;

    if (!location) return;

    const newPos = {
      lat: location.lat(),
      lng: location.lng(),
    };

    setPosition(newPos);

    if (map) {
      map.panTo(newPos);
      map.setZoom(16);
    }
  };

  useEffect(() => {
    const fetchCurrentAddress = async () => {
      if (!isLoaded || !position || isAnimating) return;

      const address = await getAddressFromLatLng(position.lat, position.lng);
      setCurrentAddress(address as string);
    };

    fetchCurrentAddress();
  }, [position, isLoaded, isAnimating]);

  useEffect(() => {
    getCurrentLocation()
      .then(async (coords) => {
        setPosition(coords);
      })
      .catch((err) => {
        console.error("Failed to get current location:", err);
        setPosition({ lat: -6.2, lng: 106.816666 });
      });
  }, []);

  const getProvinces = async () => {
    try {
      const data = await fetchProvinces();
      const formattedData = formatRegionForSelectOption(data);
      setProvinces(formattedData);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Terjadi kesalahan", {
          position: "top-center",
        });
        return;
      }

      toast.error("Terjadi kesalahan tak terduga", {
        position: "top-center",
      });
    }
  };

  const getCities = async () => {
    if (!province?.value) return;
    try {
      const data = await fetchCities(province.value);
      const formattedData = formatRegionForSelectOption(data);
      setCities(formattedData);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Terjadi kesalahan", {
          position: "top-center",
        });
        return;
      }

      toast.error("Terjadi kesalahan tak terduga", {
        position: "top-center",
      });
    }
  };

  const getDistricts = async () => {
    if (!city?.value) return;
    try {
      const data = await fetchDistricts(city.value);
      const formattedData = formatRegionForSelectOption(data);
      setDistricts(formattedData);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Terjadi kesalahan", {
          position: "top-center",
        });
        return;
      }

      toast.error("Terjadi kesalahan tak terduga", {
        position: "top-center",
      });
    }
  };

  const getSubDistricts = async () => {
    if (!district?.value) return;
    try {
      const data = await fetchSubDistricts(district.value);
      const formattedData = formatRegionForSelectOption(data);
      setSubDistricts(formattedData);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Terjadi kesalahan", {
          position: "top-center",
        });
        return;
      }

      toast.error("Terjadi kesalahan tak terduga", {
        position: "top-center",
      });
    }
  };

  const getPostalCode = async () => {
    if (!subDistrict?.value) return;
    try {
      const data: PostalCode = await fetchPostalCode(subDistrict.value);
      setValue("postalCode", data.postal_code);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Terjadi kesalahan", {
          position: "top-center",
        });
        return;
      }

      toast.error("Terjadi kesalahan tak terduga", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    getProvinces();
    return () => {};
  }, []);

  useEffect(() => {
    if (province) {
      getCities();
    }
    return () => {};
  }, [province]);

  useEffect(() => {
    if (province && city) {
      getDistricts();
    }
    return () => {};
  }, [province, city]);

  useEffect(() => {
    if (province && city && district) {
      getSubDistricts();
    }
    return () => {};
  }, [province, city, district]);

  useEffect(() => {
    if (province && city && district && subDistrict) {
      getPostalCode();
    }
    return () => {};
  }, [province, city, district, subDistrict]);

  const handleChangeProvinceOptions = (
    option: Option | null,
    fOnChange: (value: Option | null) => void
  ) => {
    fOnChange(option);

    setValue("city", null);
    setValue("district", null);
    setValue("subDistrict", null);
    setValue("postalCode", "");
  };

  const handleChangeCityOptions = (
    option: Option | null,
    fOnChange: (value: Option | null) => void
  ) => {
    fOnChange(option);

    setValue("district", null);
    setValue("subDistrict", null);
    setValue("postalCode", "");
  };

  const handleChangeDistrictOptions = (
    option: Option | null,
    fOnChange: (value: Option | null) => void
  ) => {
    fOnChange(option);

    setValue("subDistrict", null);
    setValue("postalCode", "");
  };

  const handleChangeSubDistrictOptions = (
    option: Option | null,
    fOnChange: (value: Option | null) => void
  ) => {
    fOnChange(option);

    setValue("postalCode", "");
  };

  const handleChoosePinpoint = () => {
    setIsShowMapFullScreen(false);
    // setDetailAddress(currentAddress ?? "");
  };

  const createOrOpenStore: SubmitHandler<FormStore> = async (data) => {
    try {
      const { subDistrict } = data;
      let uploadedImageUrl;

      if (avatarFile) {
        uploadedImageUrl = await uploadImage(avatarFile);
      }

      await openStore({
        avatarLink: uploadedImageUrl,
        code: subDistrict?.value,
        latLng: {
          lat: position?.lat ? position?.lat : 0,
          lng: position?.lng ? position?.lng : 0,
        },
        ...data,
      });

      navigate("/store");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Terjadi kesalahan", {
          position: "top-center",
        });
        return;
      }

      toast.error("Terjadi kesalahan tak terduga", {
        position: "top-center",
      });
    }
  };

  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = ["bold", "italic", "underline", "list", "bullet", "link"];

  return (
    <div className="relative bg-white min-h-screen rounded-t-4xl font-poppins pt-4 pb-20 px-8">
      <form
        className="flex flex-col gap-y-4"
        onSubmit={handleSubmit(createOrOpenStore)}
      >
        <div className="relative mt-20 bg-[#F2F2F2] rounded-2xl p-6 flex items-center flex-col gap-y-5 ">
          <div className="absolute -top-14">
            <div className="relative w-30 m-auto">
              <div className="w-30 h-30 shadow-lg flex justify-center items-center text-white rounded-full bg-[#F05000] overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <h3 className="uppercase text-3xl font-semibold">
                    {currentUser.username.includes(" ")
                      ? `${currentUser.username.split(" ")[0][0]}${
                          currentUser.username.split(" ")[1][0]
                        }`
                      : `${currentUser.username[0]}${currentUser.username[1]}`}
                  </h3>
                )}
              </div>

              <button
                type="button"
                className="absolute bottom-1 p-1 right-1 bg-white border-2 border-[#f05000] rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Edit2 color="#f05000" size={16} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-y-2 mt-16 w-full">
            <label htmlFor="" className="text-sm text-black/40 font-medium">
              Nama Toko
            </label>
            <input
              {...register("name")}
              className="outline-none bg-white p-3 rounded-lg text-sm border focus:border-gray-400 border-gray-200"
              placeholder="Mincuba Store"
              type="text"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="" className="text-sm text-black/40 font-medium">
              Nomor Handphone
            </label>
            <input
              {...register("phone")}
              className="outline-none bg-white p-3 rounded-lg text-sm border focus:border-gray-400 border-gray-200"
              placeholder="081234567890"
              type="text"
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="" className="text-sm text-black/40 font-medium">
              Provinsi
            </label>
            <Controller
              name="province"
              control={control}
              render={({ field }) => (
                <Select
                  unstyled
                  className="w-full"
                  classNames={{
                    control: (state) =>
                      `bg-white p-3 rounded-lg text-sm border
                  ${state.isFocused ? "border-gray-400" : "border-gray-200"}
                  outline-none`,
                    valueContainer: () => "p-0",
                    input: () => "text-sm",
                    singleValue: () => "text-sm",
                    placeholder: () => "text-sm text-gray-400",
                    menu: () => "mt-2 bg-white rounded-lg shadow text-sm",
                    option: ({ isSelected, isFocused }) =>
                      `px-3 py-2 cursor-pointer text-sm
                ${isSelected ? "bg-[#F05000] text-white" : ""}
                ${!isSelected && isFocused ? "bg-gray-100" : ""}`,
                    indicatorsContainer: () => "flex items-center gap-2",
                    clearIndicator: () =>
                      "text-gray-400 hover:text-gray-600 cursor-pointer",
                    dropdownIndicator: () =>
                      "text-gray-400 hover:text-gray-600 cursor-pointer pr-1",
                  }}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  options={provinces}
                  value={field.value}
                  onChange={(opt) =>
                    handleChangeProvinceOptions(
                      opt as Option | null,
                      field.onChange
                    )
                  }
                  isClearable
                  isSearchable
                />
              )}
            />
            {errors.province && (
              <p className="text-xs text-red-500">{errors.province.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="" className="text-sm text-black/40 font-medium">
              Kota/Kabupaten
            </label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => {
                const canSelectCity = !!province?.value;

                return (
                  <Select
                    unstyled
                    className="w-full"
                    classNames={{
                      control: (state) =>
                        `bg-white p-3 rounded-lg text-sm border
                  ${state.isFocused ? "border-gray-400" : "border-gray-200"}
                  outline-none`,
                      valueContainer: () => "p-0",
                      input: () => "text-sm",
                      singleValue: () => "text-sm",
                      placeholder: () => "text-sm text-gray-400",
                      menu: () => "mt-2 bg-white rounded-lg shadow text-sm",
                      option: ({ isSelected, isFocused }) =>
                        `px-3 py-2 cursor-pointer text-sm
                ${isSelected ? "bg-[#F05000] text-white" : ""}
                ${!isSelected && isFocused ? "bg-gray-100" : ""}`,
                      indicatorsContainer: () => "flex items-center gap-2",
                      clearIndicator: () =>
                        "text-gray-400 hover:text-gray-600 cursor-pointer",
                      dropdownIndicator: () =>
                        "text-gray-400 hover:text-gray-600 cursor-pointer pr-1",
                    }}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    options={canSelectCity ? cities : []}
                    value={field.value}
                    onChange={(opt) =>
                      handleChangeCityOptions(
                        opt as Option | null,
                        field.onChange
                      )
                    }
                    isClearable
                    isSearchable
                    isDisabled={!canSelectCity}
                  />
                );
              }}
            />
            {errors.city && (
              <p className="text-xs text-red-500">{errors.city.message}</p>
            )}
            {/* <Select
              unstyled
              className="w-full"
              classNames={{
                control: (state) =>
                  `bg-white p-3 rounded-lg text-sm border
                  ${state.isFocused ? "border-gray-400" : "border-gray-200"}
                  outline-none`,
                valueContainer: () => "p-0",
                input: () => "text-sm",
                singleValue: () => "text-sm",
                placeholder: () => "text-sm text-gray-400",
                menu: () => "mt-2 bg-white rounded-lg shadow text-sm",
                option: ({ isSelected, isFocused }) =>
                  `px-3 py-2 cursor-pointer text-sm
                ${isSelected ? "bg-[#F05000] text-white" : ""}
                ${!isSelected && isFocused ? "bg-gray-100" : ""}`,
                indicatorsContainer: () => "flex items-center gap-2",
                clearIndicator: () =>
                  "text-gray-400 hover:text-gray-600 cursor-pointer",
                dropdownIndicator: () =>
                  "text-gray-400 hover:text-gray-600 cursor-pointer pr-1",
              }}
              components={{
                IndicatorSeparator: () => null,
              }}
              options={selectedProvince ? cities : []}
              value={selectedCity}
              onChange={(val) => handleChangeCityOptions(val)}
              isClearable
              isSearchable
              isDisabled={!selectedProvince}
            /> */}
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="" className="text-sm text-black/40 font-medium">
              Kecamatan
            </label>
            <Controller
              name="district"
              control={control}
              render={({ field }) => {
                const canSelectDistrict = !!(province?.value && city?.value);

                return (
                  <Select
                    unstyled
                    className="w-full"
                    classNames={{
                      control: (state) =>
                        `bg-white p-3 rounded-lg text-sm border
                  ${state.isFocused ? "border-gray-400" : "border-gray-200"}
                  outline-none`,
                      valueContainer: () => "p-0",
                      input: () => "text-sm",
                      singleValue: () => "text-sm",
                      placeholder: () => "text-sm text-gray-400",
                      menu: () => "mt-2 bg-white rounded-lg shadow text-sm",
                      option: ({ isSelected, isFocused }) =>
                        `px-3 py-2 cursor-pointer text-sm
                ${isSelected ? "bg-[#F05000] text-white" : ""}
                ${!isSelected && isFocused ? "bg-gray-100" : ""}`,
                      indicatorsContainer: () => "flex items-center gap-2",
                      clearIndicator: () =>
                        "text-gray-400 hover:text-gray-600 cursor-pointer",
                      dropdownIndicator: () =>
                        "text-gray-400 hover:text-gray-600 cursor-pointer pr-1",
                    }}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    options={canSelectDistrict ? districts : []}
                    value={field.value}
                    onChange={(opt) =>
                      handleChangeDistrictOptions(
                        opt as Option | null,
                        field.onChange
                      )
                    }
                    isClearable
                    isSearchable
                    isDisabled={!canSelectDistrict}
                  />
                );
              }}
            />
            {errors.district && (
              <p className="text-xs text-red-500">{errors.district.message}</p>
            )}
            {/* <Select
              unstyled
              className="w-full"
              classNames={{
                control: (state) =>
                  `bg-white p-3 rounded-lg text-sm border
                  ${state.isFocused ? "border-gray-400" : "border-gray-200"}
                  outline-none`,
                valueContainer: () => "p-0",
                input: () => "text-sm",
                singleValue: () => "text-sm",
                placeholder: () => "text-sm text-gray-400",
                menu: () => "mt-2 bg-white rounded-lg shadow text-sm",
                option: ({ isSelected, isFocused }) =>
                  `px-3 py-2 cursor-pointer text-sm
                ${isSelected ? "bg-[#F05000] text-white" : ""}
                ${!isSelected && isFocused ? "bg-gray-100" : ""}`,
                indicatorsContainer: () => "flex items-center gap-2",
                clearIndicator: () =>
                  "text-gray-400 hover:text-gray-600 cursor-pointer",
                dropdownIndicator: () =>
                  "text-gray-400 hover:text-gray-600 cursor-pointer pr-1",
              }}
              components={{
                IndicatorSeparator: () => null,
              }}
              options={selectedProvince && selectedCity ? districts : []}
              value={selectedDistrict}
              onChange={(val) => handleChangeDistrictOptions(val)}
              isClearable
              isSearchable
              isDisabled={!(selectedProvince && selectedCity)}
            /> */}
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="" className="text-sm text-black/40 font-medium">
              Kelurahan
            </label>
            <Controller
              name="subDistrict"
              control={control}
              render={({ field }) => {
                const canSelectSubDistrict = !!(
                  province?.value &&
                  city?.value &&
                  district?.value
                );

                return (
                  <Select
                    unstyled
                    className="w-full"
                    classNames={{
                      control: (state) =>
                        `bg-white p-3 rounded-lg text-sm border
                  ${state.isFocused ? "border-gray-400" : "border-gray-200"}
                  outline-none`,
                      valueContainer: () => "p-0",
                      input: () => "text-sm",
                      singleValue: () => "text-sm",
                      placeholder: () => "text-sm text-gray-400",
                      menu: () => "mt-2 bg-white rounded-lg shadow text-sm",
                      option: ({ isSelected, isFocused }) =>
                        `px-3 py-2 cursor-pointer text-sm
                ${isSelected ? "bg-[#F05000] text-white" : ""}
                ${!isSelected && isFocused ? "bg-gray-100" : ""}`,
                      indicatorsContainer: () => "flex items-center gap-2",
                      clearIndicator: () =>
                        "text-gray-400 hover:text-gray-600 cursor-pointer",
                      dropdownIndicator: () =>
                        "text-gray-400 hover:text-gray-600 cursor-pointer pr-1",
                    }}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    options={canSelectSubDistrict ? subDistricts : []}
                    value={field.value}
                    onChange={(opt) =>
                      handleChangeSubDistrictOptions(
                        opt as Option | null,
                        field.onChange
                      )
                    }
                    isClearable
                    isSearchable
                    isDisabled={!canSelectSubDistrict}
                  />
                );
              }}
            />
            {errors.subDistrict && (
              <p className="text-xs text-red-500">
                {errors.subDistrict.message}
              </p>
            )}
            {/* <Select
              unstyled
              className="w-full"
              classNames={{
                control: (state) =>
                  `bg-white p-3 rounded-lg text-sm border
                  ${state.isFocused ? "border-gray-400" : "border-gray-200"}
                  outline-none`,
                valueContainer: () => "p-0",
                input: () => "text-sm",
                singleValue: () => "text-sm",
                placeholder: () => "text-sm text-gray-400",
                menu: () => "mt-2 bg-white rounded-lg shadow text-sm",
                option: ({ isSelected, isFocused }) =>
                  `px-3 py-2 cursor-pointer text-sm
                ${isSelected ? "bg-[#F05000] text-white" : ""}
                ${!isSelected && isFocused ? "bg-gray-100" : ""}`,
                indicatorsContainer: () => "flex items-center gap-2",
                clearIndicator: () =>
                  "text-gray-400 hover:text-gray-600 cursor-pointer",
                dropdownIndicator: () =>
                  "text-gray-400 hover:text-gray-600 cursor-pointer pr-1",
              }}
              components={{
                IndicatorSeparator: () => null,
              }}
              options={
                selectedProvince && selectedCity && selectedDistrict
                  ? subDistricts
                  : []
              }
              value={selectedSubDistrict}
              onChange={(val) => handleChangeSubDistrictOptions(val)}
              isClearable
              isSearchable
              isDisabled={
                !(selectedProvince && selectedCity && selectedDistrict)
              }
            /> */}
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="" className="text-sm text-black/40 font-medium">
              Kode Pos
            </label>
            <input
              {...register("postalCode")}
              className="outline-none bg-white p-3 rounded-lg text-sm border focus:border-gray-400 border-gray-200"
              placeholder="1240"
              type="text"
            />
            {errors.postalCode && (
              <p className="text-xs text-red-500">
                {errors.postalCode.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="" className="text-sm text-black/40 font-medium">
              Alamat Lengkap
            </label>
            <textarea
              {...register("detailAddress")}
              rows={5}
              className="outline-none bg-white p-3 rounded-lg text-sm border focus:border-gray-400 border-gray-200"
              placeholder="Jl. Sudirman No. 25"
            ></textarea>
            {errors.detailAddress && (
              <p className="text-xs text-red-500">
                {errors.detailAddress.message}
              </p>
            )}
            {isLoaded ? (
              <div className="flex flex-col gap-y-3">
                <button
                  type="button"
                  className="flex items-center gap-x-0.5 self-end text-xs py-1 px-2 border-2 bg-[#F05000] text-white rounded-lg font-semibold mt-1"
                  onClick={() => setIsShowMapFullScreen(true)}
                >
                  <span>Pilih Pinpoint</span>
                  <ChevronRight size={14} />
                </button>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={position || center}
                  zoom={18}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  options={{
                    disableDefaultUI: true,
                    gestureHandling: "none",
                    zoomControl: false,
                  }}
                >
                  <Marker position={position || center} />
                </GoogleMap>
              </div>
            ) : (
              <></>
            )}
          </div>

          {/* <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="" className="text-xs text-black/40 font-medium">
              Jam Operasional
            </label>
            <DatePicker
              selected={time}
              onChange={(t) => setTime(t)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={5}
              timeCaption="Time"
              dateFormat="HH:mm"
              placeholderText="10:00"
              className="w-full bg-transparent border-0 border-b border-gray-400 focus:border-blue-500 focus:ring-0 outline-none text-gray-800 py-2 placeholder:text-sm text-sm"
            />
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="" className="text-xs text-black/40 font-medium">
              Pesanan Diproses
            </label>
            <input
              className="outline-none border-b-2 border-b-[#dbdbdb] text-sm pb-2"
              placeholder="3 Jam"
              type="text"
            />
          </div> */}
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="" className="text-sm text-black/40 font-medium">
              Panduan Toko
            </label>
            <div className="flex flex-col gap-y-2">
              <Controller
                name="guide"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <ReactQuill
                      modules={modules}
                      formats={formats}
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      style={{
                        minHeight: "200px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      placeholder="Isi panduan toko, tips, atau instruksi untuk pembeli"
                    />
                    {fieldState.error && (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-2 w-full mb-3">
            <label htmlFor="" className="text-sm text-black/40 font-medium">
              Deskripsi Singkat
            </label>
            <textarea
              {...register("description")}
              rows={5}
              className="outline-none bg-white p-3 rounded-lg text-sm border focus:border-gray-400 border-gray-200 "
              placeholder="Tuliskan deskripsi singkat tentang toko anda"
            ></textarea>
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm mt-4 w-full font-semibold">
            <button
              className="bg-white text-black/70 rounded-lg p-2"
              type="button"
            >
              Batal
            </button>
            <button
              className="bg-[#F05000] text-white rounded-lg p-2"
              type="submit"
            >
              Simpan
            </button>
          </div>
        </div>
      </form>

      {isShowMapFullScreen && (
        <div className="fixed top-5 bottom-5 right-5 left-5 z-9999">
          {isLoaded ? (
            <>
              <div className="bg-black/30 backdrop-blur-[2px] fixed top-0 bottom-0 right-0 left-0"></div>
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "0.75rem",
                }}
                center={position || center}
                zoom={18}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                  disableDefaultUI: true,
                  gestureHandling: "greedy",
                  zoomControl: false,
                }}
                onClick={(e) => {
                  const newTarget = {
                    lat: e.latLng?.lat() ?? 0,
                    lng: e.latLng?.lng() ?? 0,
                  };

                  if (targetRef.current) {
                    smoothMove(targetRef.current, newTarget);
                  } else {
                    setPosition(newTarget);
                  }

                  targetRef.current = newTarget;
                }}
              >
                <Marker position={position || center} />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full px-4">
                  <Autocomplete
                    onLoad={(ref) => (autoCompleteRef.current = ref)}
                    onPlaceChanged={handlePlaceChanged}
                    options={{
                      componentRestrictions: { country: "id" },
                      fields: ["geometry", "formatted_address", "name"],
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Cari lokasi..."
                      className="w-full p-3 rounded-xl shadow-lg bg-white outline-none"
                    />
                  </Autocomplete>
                </div>
                {/* <button
                  className="w-10 h-10 bg-white flex justify-center items-center absolute right-0 top-0 z-99999"
                  onClick={() => setIsShowMapFullScreen(false)}
                >
                  <X color="#ff0000" strokeWidth={3} />
                </button> */}
                <div className="absolute bottom-0 bg-white p-4 w-full">
                  <button
                    className="w-10 h-10 rounded-lg flex justify-center items-center absolute bg-white -top-28 right-4 shadow-[0_0_10px_0_rgba(0,0,0,0.2)] "
                    onClick={() => {
                      getCurrentLocation()
                        .then((coords) => setPosition(coords))
                        .catch((err) => {
                          console.error("Failed to get current location:", err);
                          setPosition({ lat: -6.2, lng: 106.816666 });
                        });
                    }}
                  >
                    <LocateFixed color="#F05000" size={21} />
                  </button>
                  <button
                    className="w-10 h-10 rounded-lg flex justify-center items-center absolute bg-[#F05000] -top-14 right-4 shadow-[0_0_10px_0_rgba(0,0,0,0.2)] "
                    onClick={() => setIsShowMapFullScreen(false)}
                  >
                    <Minimize2 color="#fff" size={21} />
                  </button>
                  <div className="flex flex-col gap-y-3">
                    <h6>{currentAddress}</h6>
                    <button
                      className="bg-[#F05000] text-white w-full p-2 font-semibold rounded-lg"
                      onClick={handleChoosePinpoint}
                    >
                      Pilih Pinpoint
                    </button>
                  </div>
                </div>
              </GoogleMap>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
