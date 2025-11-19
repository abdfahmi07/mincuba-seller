import { NavLink } from "react-router-dom";

export default function NotFound({
  icon,
  message,
  urlNavigate,
  titleBtn,
}: {
  icon: string;
  message: string;
  urlNavigate: string;
  titleBtn: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center gap-y-10 font-poppins px-4">
      <div className="flex flex-col gap-y-3 justify-center items-center text-center">
        <img className="w-45" src={icon} alt="Icon" />
        <h6>{message}</h6>
      </div>
      <NavLink to={urlNavigate}>
        <button className="bg-[#F05000] text-white py-3 px-6 rounded-lg font-semibold cursor-pointer text-sm">
          {titleBtn}
        </button>
      </NavLink>
    </div>
  );
}
