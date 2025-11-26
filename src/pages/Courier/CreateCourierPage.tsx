import { useState } from "react";
import type { CourierPayload } from "@/interface/ICourier";
import { createCourier } from "@/services/api/courier";
import { yupResolver } from "@hookform/resolvers/yup";
import { isAxiosError } from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";

const schemaValidationFormCourier = Yup.object({
  name: Yup.string().required("Nama Kurir wajib diisi"),
  phone: Yup.string()
    .required("Nomor HP wajib diisi")
    .matches(
      /^(\\+62|62|0)8[1-9][0-9]{6,12}$/,
      "Nomor HP tidak valid, gunakan format Indonesia"
    ),
  email: Yup.string()
    .trim()
    .email("Email tidak valid, cek kembali")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Format email tidak valid")
    .required("Email wajib diisi"),
  password: Yup.string()
    .required("Password wajib diisi")
    .min(8, "Minimal 8 karakter")
    .matches(/[A-Z]/, "Harus ada huruf kapital (A-Z)")
    .matches(/[a-z]/, "Harus ada huruf kecil (a-z)")
    .matches(/[0-9]/, "Harus ada angka (0-9)")
    .matches(/[^A-Za-z0-9]/, "Harus ada simbol (!@#$% dll)"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Konfirmasi password tidak cocok")
    .required("Konfirmasi password wajib diisi"),
});

type FormCourier = Yup.InferType<typeof schemaValidationFormCourier>;

export default function CreateCourier() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormCourier>({
    resolver: yupResolver(schemaValidationFormCourier),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const addCourier: SubmitHandler<FormCourier> = async (data) => {
    try {
      const payload: CourierPayload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      };
      await createCourier(payload);
      navigate("/couriers");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.result?.error ?? "Terjadi kesalahan", {
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
    <div className="bg-white min-h-screen rounded-t-4xl font-poppins pt-6 px-6 mb-24">
      <form
        className="flex flex-col gap-y-6"
        onSubmit={handleSubmit(addCourier)}
      >
        {/* Nama Kurir */}
        <div className="flex flex-col gap-y-4 text-sm">
          <label className="font-medium">Nama Kurir</label>
          <div className="flex flex-col gap-y-2">
            <input
              className="outline-none border-b-2 border-black/10 py-2 placeholder:text-[#B4B4B4]"
              type="text"
              placeholder="John Doe"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-y-4 text-sm">
          <label className="font-medium">Email</label>
          <div className="flex flex-col gap-y-2">
            <input
              className="outline-none border-b-2 border-black/10 py-2 placeholder:text-[#B4B4B4]"
              type="text"
              placeholder="johndoe@gmail.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Nomor Handphone */}
        <div className="flex flex-col gap-y-4 text-sm">
          <label className="font-medium">Nomor Handphone</label>
          <div className="flex flex-col gap-y-2">
            <input
              className="outline-none border-b-2 border-black/10 py-2 placeholder:text-[#B4B4B4]"
              type="text"
              inputMode="numeric"
              placeholder="081234567890"
              {...register("phone")}
              onKeyDown={(e) => {
                const allowedKeys = [
                  "Backspace",
                  "Delete",
                  "ArrowLeft",
                  "ArrowRight",
                  "Tab",
                ];

                if (allowedKeys.includes(e.key)) return;

                // cuma izinkan angka 0-9
                if (!/^[0-9]$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("text");
                // kalau yang di-paste bukan angka semua, block
                if (!/^\d+$/.test(pasted)) {
                  e.preventDefault();
                }
              }}
              onInput={async (e) => {
                // jaga-jaga kalau ada yang lolos, tetap dibersihkan
                e.currentTarget.value = e.currentTarget.value.replace(
                  /\D/g,
                  ""
                );
                await trigger("phone"); // biar error Yup ke-update realtime
              }}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-y-4 text-sm">
          <label className="font-medium">Password</label>
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-2 border-b-2 border-black/10 py-2">
              <input
                className="outline-none flex-1 placeholder:text-[#B4B4B4]"
                type={showPassword ? "text" : "password"}
                placeholder="Secret@123"
                {...register("password")}
              />
              <button
                type="button"
                className="text-xs text-[#F05000] font-medium"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>
        </div>

        {/* Konfirmasi Password */}
        <div className="flex flex-col gap-y-4 text-sm">
          <label className="font-medium">Konfirmasi Password</label>
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-2 border-b-2 border-black/10 py-2">
              <input
                className="outline-none flex-1 placeholder:text-[#B4B4B4]"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Secret@123"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                className="text-xs text-[#F05000] font-medium"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-3 py-3 rounded-lg text-white font-semibold bg-[#F05000] text-sm"
        >
          Tambahkan
        </button>
      </form>
      <ToastContainer hideProgressBar />
    </div>
  );
}
