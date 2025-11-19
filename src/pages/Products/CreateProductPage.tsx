import MultipleImageUpload from "@/components/MultipleImageUploader/MultipleImageUploader";
import type { PreviewImage } from "@/interface/IPreviewImage";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import ReactQuill from "react-quill-new";
import Select from "react-select";
import "react-quill-new/dist/quill.snow.css";
import type { Option } from "@/interface/ISelectOption";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { createProduct } from "@/services/api/product";
import { useNavigate } from "react-router-dom";

const schemaValidationCreateProduct = Yup.object({
  images: Yup.array()
    .min(1, "Foto produk wajib diisi")
    .required("Foto produk wajib diisi"),
  name: Yup.string().required("Nama wajib diisi"),
  price: Yup.string().required("Harga wajib diisi"),
  stock: Yup.string().required("Stok wajib diisi"),
  minOrder: Yup.string().required("Min. pemesanan wajib diisi"),
  description: Yup.string()
    .test("desc-required", "Deskripsi wajib diisi", (value) => {
      if (!value) return false;

      const plainText = value
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();

      return plainText.length > 0;
    })
    .required("Deskripsi wajib diisi"),
  weight: Yup.string().required("Berat wajib diisi"),
  condition: Yup.object({
    value: Yup.string(),
    label: Yup.string(),
  })
    .nullable()
    .test(
      "required-condition",
      "Kondisi barang wajib dipilih",
      (v) => !!v && !!v.value
    ),
  unit: Yup.object({
    value: Yup.string(),
    label: Yup.string(),
  })
    .nullable()
    .test(
      "required-unit",
      "Unit barang wajib dipilih",
      (v) => !!v && !!v.value
    ),
}).required();

type CreateProductFormValues = Yup.InferType<
  typeof schemaValidationCreateProduct
>;

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const formats = ["bold", "italic", "underline", "list", "bullet", "link"];

export default function CreateProductPage() {
  const navigate = useNavigate();
  const conditionOptions: Option[] = [
    {
      label: "Baru",
      value: "Baru",
    },
    {
      label: "Bekas",
      value: "Bekas",
    },
  ];

  const unitOptions: Option[] = [
    {
      label: "Liter",
      value: "liter",
    },
    {
      label: "Gram",
      value: "grams",
    },
  ];
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateProductFormValues>({
    resolver: yupResolver(schemaValidationCreateProduct),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      images: [],
      name: "",
      price: "",
      stock: "",
      minOrder: "",
      description: "",
      weight: "",
      condition: conditionOptions[0],
      unit: unitOptions[0],
    },
  });

  const unitValue = watch("unit");

  const uploadImage = async (imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append("folder", "product");
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

  const uploadAllImages = async (files: File[]) => {
    const uploadPromises = files.map((file) => uploadImage(file));
    const results = await Promise.all(uploadPromises);

    return results.filter((url) => url);
  };

  const addProduct = async (data: CreateProductFormValues) => {
    try {
      const imageFiles = data.images.map((image) => image.file);

      const uploadedImageUrls = await uploadAllImages(imageFiles);

      const payload = {
        name: data.name,
        description: data.description,
        price: parseInt(data.price),
        condition: data.condition?.value ?? "",
        unit: data.unit?.value ?? "",
        weight: parseInt(data.weight),
        min: parseInt(data.minOrder),
        stock: parseInt(data.stock),
        images: uploadedImageUrls,
      };
      await createProduct(payload);
      navigate("/products");
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

  return (
    <div className="px-4 py-5 mb-24 font-poppins">
      <form
        className="flex flex-col gap-y-6"
        onSubmit={handleSubmit(addProduct)}
      >
        <div className="flex flex-col gap-y-3">
          <label className="font-medium">Foto Produk</label>
          <Controller
            name="images"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <MultipleImageUpload
                  images={field.value as PreviewImage[]}
                  onChange={field.onChange}
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

        <div className="flex flex-col gap-y-4">
          <label className="font-medium">Isi nama produk yang kamu jual</label>
          <div className="flex flex-col gap-y-2">
            <input
              className="outline-none border-b-2 border-black/10 py-2 placeholder:text-[#B4B4B4]"
              type="text"
              placeholder="Nama Produk"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
            <p className="text-xs text-[#868686]">
              Tips: Jenis Produk + Merek Produk + Keterangan Tambahan
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <label className="font-medium">Harga</label>
          <div className="flex flex-col gap-y-2">
            <div className="relative">
              <span className="absolute left-0 bottom-3 text-[#B4B4B4] font-semibold">
                Rp
              </span>
              <input
                className="outline-none border-b-2 border-black/10 py-2 placeholder:text-[#B4B4B4] pl-7 w-full"
                type="text"
                placeholder="Harga"
                {...register("price")}
              />
            </div>
            {errors.price && (
              <p className="text-xs text-red-500">{errors.price.message}</p>
            )}
            <p className="text-xs text-[#868686]">
              Tentukan harga sesuai pasaran produkmu
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <label className="font-medium">Stok</label>
          <div className="flex flex-col gap-y-2">
            <input
              className="outline-none border-b-2 border-black/10 py-2 placeholder:text-[#B4B4B4]"
              type="text"
              placeholder="Stok Tersedia"
              {...register("stock")}
            />
            {errors.stock && (
              <p className="text-xs text-red-500">{errors.stock.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <label className="font-medium">Min. Pesanan</label>
          <div className="flex flex-col gap-y-2">
            <input
              className="outline-none border-b-2 border-black/10 py-2 placeholder:text-[#B4B4B4]"
              type="text"
              placeholder="Minimum Pesanan"
              {...register("minOrder")}
            />
            {errors.minOrder && (
              <p className="text-xs text-red-500">{errors.minOrder.message}</p>
            )}
          </div>
        </div>

        {/* <div className="flex flex-col gap-y-4">
          <label className="font-medium">Stok</label>
          <div className="flex flex-col gap-y-2">
            <input
              className="outline-none border-b-2 border-black/10 py-2 placeholder:text-[#B4B4B4]"
              type="text"
              placeholder="Stok Tersedia"
              {...register("stock")}
            />
            {errors.stock && (
              <p className="text-xs text-red-500">{errors.stock.message}</p>
            )}
            <input
              className="outline-none border-b-2 border-black/10 py-2 placeholder:text-[#B4B4B4]"
              type="text"
              placeholder="Minimum Pesanan"
              {...register("minOrder")}
            />
            {errors.minOrder && (
              <p className="text-xs text-red-500">{errors.minOrder.message}</p>
            )}
          </div>
        </div> */}

        <div className="flex flex-col gap-y-2">
          <label className="font-medium">Kondisi</label>
          <Controller
            name="condition"
            control={control}
            render={({ field }) => {
              return (
                <Select
                  unstyled
                  className="w-full"
                  classNames={{
                    control: (state) =>
                      `bg-white py-2 border-b-2
                  ${state.isFocused ? "border-black/20" : "border-black/10"}
                  outline-none`,
                    valueContainer: () => "p-0",
                    placeholder: () => "text-[#B4B4B4]",
                    menu: () => "mt-2 bg-white rounded-lg shadow",
                    option: ({ isSelected, isFocused }) =>
                      `px-3 py-2 cursor-pointer 
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
                  options={conditionOptions}
                  onChange={(option) => field.onChange(option)}
                  value={field.value}
                  isClearable
                  isSearchable
                />
              );
            }}
          />
          {errors.condition && (
            <p className="text-xs text-red-500">{errors.condition.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="font-medium">Unit</label>
          <Controller
            name="unit"
            control={control}
            render={({ field }) => {
              return (
                <Select
                  unstyled
                  className="w-full"
                  classNames={{
                    control: (state) =>
                      `bg-white py-2 border-b-2
                  ${state.isFocused ? "border-black/20" : "border-black/10"}
                  outline-none`,
                    valueContainer: () => "p-0",
                    placeholder: () => "text-[#B4B4B4]",
                    menu: () => "mt-2 bg-white rounded-lg shadow",
                    option: ({ isSelected, isFocused }) =>
                      `px-3 py-2 cursor-pointer 
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
                  options={unitOptions}
                  value={field.value}
                  onChange={(option) => field.onChange(option)}
                  isClearable
                  isSearchable
                />
              );
            }}
          />
          {errors.unit && (
            <p className="text-xs text-red-500">{errors.unit.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-y-4 w-fit">
          <label className="font-medium">Tentukan berat pengirimanmu</label>
          <div className="flex flex-col gap-y-2">
            <div className="relative w-40 border-b-2 border-black/10">
              <input
                className="outline-none py-2 placeholder:text-[#B4B4B4] w-[65%]"
                type="number"
                placeholder="Berat"
                {...register("weight")}
              />
              <span className="absolute right-0 bottom-2 text-[#B4B4B4] font-semibold bg-white">
                {unitValue?.label}
              </span>
            </div>
            {errors.weight && (
              <p className="text-xs text-red-500">{errors.weight.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <label className="font-medium">Tulis deskripsi produk kamu</label>
          <div className="flex flex-col gap-y-2">
            <Controller
              name="description"
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
                      fontSize: "1rem",
                    }}
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

        <button
          type="submit"
          className="w-full py-3 rounded-lg text-white font-semibold bg-[#F05000]"
        >
          Tambahkan
        </button>
      </form>
    </div>
  );
}
