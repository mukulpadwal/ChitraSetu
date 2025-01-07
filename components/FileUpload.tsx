"use client";

import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function FileUpload({
  onSuccess,
}: {
  onSuccess: (response: IKUploadResponse) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handelOnError = (err: { message: string }) => {
    setError(err.message);
    setUploading(false);
  };

  const handleOnSuccess = (response: IKUploadResponse) => {
    setUploading(false);
    setError(null);
    onSuccess(response);
  };

  const handleStartUpload = () => {
    setUploading(true);
    setError(null);
  };

  return (
    <div className="space-y-2">
      <IKUpload
        fileName="product-image.png"
        onError={handelOnError}
        onSuccess={handleOnSuccess}
        onUploadStart={handleStartUpload}
        validateFile={(file: File) => {
          const validFileTypes = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp",
          ];

          if (!validFileTypes.includes(file.type)) {
            setError("Invaild file type...");
            return false;
          }

          if (file.size > 5 * 1024 * 1024) {
            // 5MB
            setError("File size too large...");
            return false;
          }

          return true;
        }}
      />

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}

      {error && <div className="text-error text-sm">{error}</div>}
    </div>
  );
}
