// src/utils/confirm.ts
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "primary" | "danger";
};

export async function confirmAlert(
  options: ConfirmOptions = {}
): Promise<boolean> {
  const {
    title = "Yakin melakukan aksi ini?",
    description = "Aksi ini tidak dapat dibatalkan.",
    confirmText = "Ya, lanjutkan",
    cancelText = "Batal",
    variant = "primary",
  } = options;

  const confirmButtonClass =
    variant === "danger"
      ? "px-3 py-1.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700"
      : "px-3 py-1.5 rounded-lg text-sm font-medium bg-sky-600 text-white hover:bg-sky-700";

  const result = await MySwal.fire({
    icon: undefined,
    title,
    html: `<p class="text-sm text-gray-500">${description}</p>`,
    showCancelButton: true,
    buttonsStyling: false,
    reverseButtons: true,
    focusCancel: true,
    customClass: {
      popup:
        "rounded-2xl bg-white border border-gray-100 shadow-lg max-w-sm w-full !p-5",
      title: "text-base font-semibold text-gray-900 mb-1",
      htmlContainer: "mt-1",
      actions: "flex justify-end gap-2 mt-4",
      confirmButton: confirmButtonClass,
      cancelButton:
        "px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200",
    },
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });

  return result.isConfirmed;
}
