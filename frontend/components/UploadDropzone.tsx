"use client";

import { useCallback, useState } from "react";

interface UploadDropzoneProps {
  onUpload: (files: File[]) => Promise<void>;
  multiple?: boolean;
}

export default function UploadDropzone({
  onUpload,
  multiple = true,
}: UploadDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<{ name: string; url: string }[]>([]);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) =>
        f.type.startsWith("image/") || f.type.startsWith("video/")
      );
      if (!list.length) return;

      setPreviews(
        list.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }))
      );
      setUploading(true);
      try {
        await onUpload(list);
      } finally {
        setUploading(false);
        setPreviews([]);
      }
    },
    [onUpload]
  );

  return (
    <div
      className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
        dragging
          ? "border-[#7c9cff] bg-[#7c9cff]/10"
          : "border-white/20 bg-white/5"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        processFiles(e.dataTransfer.files);
      }}
    >
      <p className="mb-2 text-white/80">Drag & drop photos or videos here</p>
      <p className="mb-4 text-sm text-white/40">or click to browse</p>
      <label className="btn-primary inline-block cursor-pointer rounded-lg px-5 py-2 text-sm">
        {uploading ? "Uploading..." : "Choose files"}
        <input
          type="file"
          className="hidden"
          accept="image/*,video/*"
          multiple={multiple}
          disabled={uploading}
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />
      </label>

      {previews.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {previews.map((p) => (
            <div key={p.name} className="h-16 w-16 overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
