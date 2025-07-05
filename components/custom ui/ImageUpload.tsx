import { useRef } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Plus, Trash } from "lucide-react";

interface ImageUploadProps {
  value: string[]; // Always an array of URLs
  onChange: (urls: string[]) => void;
  onRemove: (url: string) => void;
  multiple?: boolean; // Single or multiple image upload mode
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  multiple = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dukkrhzsb/upload";
  const UPLOAD_PRESET = "zecusello";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        return data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      if (multiple) {
        onChange([...value, ...uploadedUrls]); // Append new images
      } else {
        onChange([uploadedUrls[0]]); // Only keep the latest image
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong during the upload. Please try again.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset input to allow re-uploading the same file
      }
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {value.map((url) => (
          url && ( // Only render if url is not an empty string
            <div key={url} className="relative w-[200px] h-[200px]">
              <div className="absolute top-0 right-0 z-10">
                <Button
                  type="button"
                  onClick={() => onRemove(url)}
                  size="sm"
                  className="bg-red-1 text-white"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <Image src={url} alt="uploaded" className="object-cover rounded-lg" fill />
            </div>
          )
        ))}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        multiple={multiple}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Trigger Button */}
      <Button
        type="button"
        className="bg-grey-1 text-white"
        onClick={() => fileInputRef.current?.click()}
      >
        <Plus className="h-4 w-4 mr-2" />
        Upload Image{multiple && "s"}
      </Button>
    </div>
  );
};

export default ImageUpload;
