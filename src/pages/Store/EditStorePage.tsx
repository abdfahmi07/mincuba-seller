import user from "@/assets/images/product/user.jpeg";
import { userStorage } from "@/helpers/userStorage";
import { useStoreStatus } from "@/queries/useStoreStatus";
import { ChevronRight, Edit2, LocateFixed, Minimize2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import type { SelectOption } from "@/interface/ISelectOption";
import { getAddressFromLatLng, getCurrentLocation } from "@/helpers/location";
import Select, { type SingleValue } from "react-select";
import { toast } from "react-toastify";
import {
  fetchCities,
  fetchDistricts,
  fetchPostalCode,
  fetchProvinces,
  fetchSubDistricts,
} from "@/services/api/region";
import { formatRegionForSelectOption } from "@/helpers/selectOption";
import * as Yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import "./style/index.css";
import type { PostalCode } from "@/interface/IRegion";

// const schemaValidationStore = Yup.object().shape({

// })

export default function EditStorePage() {
  const { data } = useStoreStatus();
  const [isShowMapFullScreen, setIsShowMapFullScreen] =
    useState<boolean>(false);
  const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [currentAddress, setCurrentAddress] = useState<string | null>("");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [provinces, setProvinces] = useState<SelectOption[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<SelectOption | null>(
    null
  );
  const [cities, setCities] = useState<SelectOption[]>([]);
  const [selectedCity, setSelectedCity] = useState<SelectOption | null>(null);
  const [districts, setDistricts] = useState<SelectOption[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<SelectOption | null>(
    null
  );
  const [subDistricts, setSubDistricts] = useState<SelectOption[]>([]);
  const [selectedSubDistrict, setSelectedSubDistrict] =
    useState<SelectOption | null>(null);
  const [selectedPostalCode, setSelectedPostalCode] = useState<string>("");
  const [detailAddress, setDetailAddress] = useState<string>("");
  const targetRef = useRef<google.maps.LatLngLiteral | null>(null);
  const animationFrame = useRef<number | null>(null);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const currentUser = userStorage.get();

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

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
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

        // ✅ animasi selesai
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
      setCurrentAddress(address);
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
    } catch (err: any) {
      toast.error(err.response.message, {
        position: "top-center",
      });
    }
  };

  const getCities = async () => {
    try {
      const data = await fetchCities(selectedProvince?.value);
      const formattedData = formatRegionForSelectOption(data);
      setCities(formattedData);
    } catch (err: any) {
      toast.error(err.response.message, {
        position: "top-center",
      });
    }
  };

  const getDistricts = async () => {
    try {
      const data = await fetchDistricts(`${selectedCity?.value}`);
      const formattedData = formatRegionForSelectOption(data);
      setDistricts(formattedData);
    } catch (err: any) {
      toast.error(err.response.message, {
        position: "top-center",
      });
    }
  };

  const getSubDistricts = async () => {
    try {
      const data = await fetchSubDistricts(`${selectedDistrict?.value}`);
      const formattedData = formatRegionForSelectOption(data);
      setSubDistricts(formattedData);
    } catch (err: any) {
      toast.error(err.response.message, {
        position: "top-center",
      });
    }
  };

  const getPostalCode = async () => {
    try {
      const data: PostalCode = await fetchPostalCode(
        `${selectedSubDistrict?.value}`
      );
      setSelectedPostalCode(data.postal_code);
    } catch (err: any) {
      toast.error(err.response.message, {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    getProvinces();
    return () => {};
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      getCities();
    }
    return () => {};
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedProvince && selectedCity) {
      getDistricts();
    }
    return () => {};
  }, [selectedProvince, selectedCity]);

  useEffect(() => {
    if (selectedProvince && selectedCity && selectedDistrict) {
      getSubDistricts();
    }
    return () => {};
  }, [selectedProvince, selectedCity, selectedDistrict]);

  useEffect(() => {
    if (
      selectedProvince &&
      selectedCity &&
      selectedDistrict &&
      selectedSubDistrict
    ) {
      getPostalCode();
    }
    return () => {};
  }, [selectedProvince, selectedCity, selectedDistrict, selectedSubDistrict]);

  const handleChangeProvinceOptions = (value: SingleValue<SelectOption>) => {
    setSelectedProvince(value);
    setSelectedCity(null);
    setSelectedDistrict(null);
    setSelectedSubDistrict(null);
    setSelectedPostalCode("");
  };

  const handleChangeCityOptions = (value: SingleValue<SelectOption>) => {
    setSelectedCity(value);
    setSelectedDistrict(null);
    setSelectedSubDistrict(null);
    setSelectedPostalCode("");
  };

  const handleChangeDistrictOptions = (value: SingleValue<SelectOption>) => {
    setSelectedDistrict(value);
    setSelectedSubDistrict(null);
    setSelectedPostalCode("");
  };

  const handleChangeSubDistrictOptions = async (
    value: SingleValue<SelectOption>
  ) => {
    setSelectedSubDistrict(value);
    setSelectedPostalCode("");
  };

  const handleChoosePinpoint = () => {
    setIsShowMapFullScreen(false);
    // setDetailAddress(currentAddress ?? "");
  };

  return (
    <div className="relative bg-white min-h-screen rounded-t-4xl font-poppins pt-4 pb-20 px-8">
      <form className="flex flex-col gap-y-4">
        <div className="relative mt-20 bg-[#F2F2F2] rounded-2xl p-6 flex items-center flex-col gap-y-5 ">
          <div className="absolute -top-14">
            <div className="relative w-30 m-auto">
              {data?.exists ? (
                <img
                  className="rounded-full border-4 border-white w-full"
                  src={user}
                  alt="User"
                />
              ) : (
                <div className="w-30 h-30 flex justify-center items-center text-white rounded-full bg-[#F05000] ">
                  <h3 className="uppercase text-3xl font-semibold">
                    {currentUser.username.includes(" ")
                      ? `${currentUser.username.split(" ")[0][0]}${
                          currentUser.username.split(" ")[1][0]
                        }`
                      : `${currentUser.username[0]}${currentUser.username[1]}`}
                  </h3>
                </div>
              )}

              <div className="absolute bottom-1 p-1 right-1 bg-white border-2 border-[#f05000] rounded-full">
                <Edit2 color="#f05000" size={16} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-2 mt-16 w-full">
            <label htmlFor="" className="text-sm text-black/40 font-medium">
              Nama Toko
            </label>
            <input
              className="outline-none bg-white p-3 rounded-lg text-sm border focus:border-gray-400 border-gray-200"
              placeholder="Mincuba Store"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="" className="text-sm text-black/40 font-medium">
              Nomor Handphone
            </label>
            <input
              className="outline-none bg-white p-3 rounded-lg text-sm border focus:border-gray-400 border-gray-200"
              placeholder="081234567890"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="" className="text-sm text-black/40 font-medium">
              Provinsi
            </label>
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
              value={selectedProvince}
              onChange={(val) => handleChangeProvinceOptions(val)}
              isClearable
              isSearchable
            />
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="" className="text-sm text-black/40 font-medium">
              Kota/Kabupaten
            </label>
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
              options={selectedProvince ? cities : []}
              value={selectedCity}
              onChange={(val) => handleChangeCityOptions(val)}
              isClearable
              isSearchable
              isDisabled={!selectedProvince}
            />
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="" className="text-sm text-black/40 font-medium">
              Kecamatan
            </label>
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
              options={selectedProvince && selectedCity ? districts : []}
              value={selectedDistrict}
              onChange={(val) => handleChangeDistrictOptions(val)}
              isClearable
              isSearchable
              isDisabled={!(selectedProvince && selectedCity)}
            />
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="" className="text-sm text-black/40 font-medium">
              Kelurahan
            </label>
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
            />
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="" className="text-sm text-black/40 font-medium">
              Kode Pos
            </label>
            <input
              className="outline-none bg-white p-3 rounded-lg text-sm border focus:border-gray-400 border-gray-200"
              value={selectedPostalCode}
              onChange={(e) => setSelectedPostalCode(e.target.value)}
              placeholder="1240"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="" className="text-sm text-black/40 font-medium">
              Alamat Lengkap
            </label>
            <textarea
              rows={5}
              className="outline-none bg-white p-3 rounded-lg text-sm border focus:border-gray-400 border-gray-200"
              placeholder="Jl. Sudirman No. 25"
              onChange={(e) => setDetailAddress(e.target.value)}
              value={detailAddress}
            ></textarea>
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
              Deskripsi Singkat
            </label>
            <textarea
              rows={5}
              className="outline-none bg-white p-3 rounded-lg text-sm border focus:border-gray-400 border-gray-200 mb-3"
              placeholder="Tuliskan secara singkat tentang toko Anda"
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm mt-4 w-full font-semibold">
            <button className="bg-white text-black/70 rounded-lg p-2">
              Batal
            </button>
            <button className="bg-[#F05000] text-white rounded-lg p-2">
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
