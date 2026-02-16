import { Upload, Music, Image as ImageIcon, Video, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MediaScannerInputProps {
  onFileSelect: (file: File) => void;
  isScanning: boolean;
}

const MediaScannerInput = ({ onFileSelect, isScanning }: MediaScannerInputProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "audio/mpeg", "audio/wav", "audio/ogg",
      "video/mp4", "video/mpeg", "video/quicktime",
    ];

    const maxSize = 500 * 1024 * 1024; // 500MB

    if (!allowedTypes.includes(file.type)) {
      setError("❌ Unsupported file type. Please upload an image, audio, or video file.");
      return false;
    }

    if (file.size > maxSize) {
      setError("❌ File too large. Maximum size is 500MB.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (validateFile(files[0])) {
        onFileSelect(files[0]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      if (validateFile(files[0])) {
        onFileSelect(files[0]);
      }
    }
  };

  return (
    <>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
          dragActive
            ? "border-primary bg-primary/10"
            : "border-border/50 hover:border-primary/50 bg-secondary/20"
        } ${isScanning ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          type="file"
          onChange={handleChange}
          disabled={isScanning}
          accept="image/*,audio/*,video/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4 justify-center text-muted-foreground">
            <ImageIcon className="w-8 h-8" />
            <Music className="w-8 h-8" />
            <Video className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Upload Image, Audio, or Video
            </h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop or click to upload. Max 500MB.
            </p>
          </div>
          <Button disabled={isScanning} variant="outline" size="sm" className="mt-2">
            <Upload className="w-4 h-4 mr-2" />
            Select File
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </>
  );
};

export default MediaScannerInput;