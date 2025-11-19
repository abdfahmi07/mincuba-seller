import headerLoginBg from "@/assets/images/background/login.png";
import headerLogo from "@/assets/images/logo/logo.png";
import { login } from "@/services/api/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import * as yup from "yup";

type Inputs = {
  username: string;
  password: string;
};

const schemaValidation = yup.object({
  username: yup.string().required("Username harus diisi"),
  password: yup.string().required("Password harus diisi"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);

  console.log(import.meta.env.MODE); // "staging"
  console.log(import.meta.env.VITE_APP_ENV); // "staging"
  console.log(import.meta.env.VITE_API_BASE_URL);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schemaValidation),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    try {
      const { username, password } = values;
      const data = await login(username, password);
      console.log("Login success:", data);
      navigate("/");
    } catch (err) {
      console.log("ERRORRR", err);
      toast.error("Username atau password salah!", {
        position: "top-center",
      });
    }
  };

  return (
    <>
      <form className="font-poppins" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div
            className="bg-black w-full bg-no-repeat bg-cover h-56 rounded-3xl relative"
            style={{
              backgroundImage: `url(${headerLoginBg})`,
            }}
          >
            <img
              className="absolute -top-6 bottom-0 right-0 left-0 m-auto w-64 "
              src={headerLogo}
              alt="Mincuba Marketplace"
            />
            <div className="absolute -bottom-5 right-0 left-0 m-auto w-[85%] bg-[#F05000] rounded-4xl p-3 flex justify-center text-white">
              <h2 className="font-semibold text-sm">Masuk Sebagai Penjual</h2>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-6 items-center mt-14 mb-10">
          <div className="flex items-center flex-col gap-y-3 w-full">
            <div className="flex flex-col gap-y-2 w-[85%]">
              <input
                className="outline-none shadow-[0_3px_2px_rgba(0,0,0,0.12)] p-4 bg-[#F2F2F2] placeholder:font-semibold placeholder:text-[#BFBFBF] rounded-3xl w-full text-sm text-[#5a5a5a]"
                type="text"
                placeholder="Username"
                {...register("username")}
              />
              <p className="text-xs text-red-500 pl-3">
                {errors.username?.message}
              </p>
            </div>
            <div className="flex flex-col gap-y-2 w-[85%]">
              <div className="relative w-full">
                <input
                  className="outline-none shadow-[0_3px_2px_rgba(0,0,0,0.12)] p-4 bg-[#F2F2F2] placeholder:font-semibold placeholder:text-[#BFBFBF] w-full rounded-3xl text-sm text-[#5a5a5a]"
                  type={`${isShowPassword ? "text" : "password"}`}
                  placeholder="Kata Sandi"
                  {...register("password")}
                />
                {isShowPassword ? (
                  <Eye
                    onClick={() => setIsShowPassword(!isShowPassword)}
                    className="absolute right-4 top-[50%] -translate-y-[50%] m-auto"
                    color="#ababab"
                  />
                ) : (
                  <EyeOff
                    onClick={() => setIsShowPassword(!isShowPassword)}
                    className="absolute right-4 top-[50%] -translate-y-[50%] m-auto"
                    color="#ababab"
                  />
                )}
              </div>
              <p className="text-xs text-red-500 pl-3">
                {errors.password?.message}
              </p>
            </div>
          </div>
          <p className="font-normal text-xs text-[#929292]">
            Lupa kata sandi?{" "}
            <span className="font-bold text-[#F05000]">Klik disini</span>
          </p>
        </div>
        <div className="fixed w-full max-w-md left-0 right-0 m-auto bottom-4 px-4">
          <button
            type="submit"
            className="w-[85%] bg-[#F05000] hover:bg-[#e14b00] transition-colors rounded-4xl p-3 text-white m-auto flex justify-center cursor-pointer"
          >
            <h2 className="font-semibold text-sm">Masuk</h2>
          </button>
        </div>
      </form>
      <ToastContainer hideProgressBar />
    </>
  );
}
