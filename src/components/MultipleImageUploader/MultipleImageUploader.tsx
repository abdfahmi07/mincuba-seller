import React, { useRef, useEffect } from "react";
import type { PreviewImage } from "@/interface/IPreviewImage";
import addImageIcon from "@/assets/images/icon/add-image-3.png";

interface MultipleImageUploadProps {
  images: PreviewImage[];
  onChange: (images: PreviewImage[]) => void;
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  images,
  onChange,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: PreviewImage[] = Array.from(files).map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
    }));

    onChange([...images, ...newImages]);
  };

  const removeImage = (id: string) => {
    const target = images.find((img) => img.id === id);
    if (target) URL.revokeObjectURL(target.url);

    onChange(images.filter((img) => img.id !== id));
  };

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  return (
    <div className="flex flex-wrap gap-2">
      <div className={`grid grid-cols-4 gap-2 auto-rows-[6rem]`}>
        {images.length > 0 &&
          images.map((img) => (
            <div
              key={img.id}
              className="relative rounded-lg overflow-hidden border shadow-sm"
            >
              <img
                src={img.url}
                alt={img.file.name}
                className="w-full h-24 object-cover"
              />

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs 
                           px-2 py-1 rounded hover:bg-black/80 transition"
              >
                Remove
              </button>
            </div>
          ))}
        <div className={`${images.length > 0 ? "w-full" : "w-24"} `}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={openPicker}
            className="flex flex-col w-full h-24 justify-center items-center gap-2 border-2 border-dashed border-black/50 
                  text-black/70 rounded-md font-medium  text-sm"
          >
            <img className="w-15 h-15" src={addImageIcon} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultipleImageUpload;
