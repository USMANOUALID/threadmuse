"use client";

import * as React from "react";
import { Image as ImageIcon, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Real drag-and-drop zone for the upload form. Owns no state itself — the
 * parent form holds the File objects and passes them down. We render the
 * previews via `URL.createObjectURL`, then revoke on unmount.
 *
 * The visual treatment matches the Phase-2 static version: warm dropzone,
 * surface plate at top, gallery thumb row at bottom.
 */

export interface UploadDropzoneProps {
  cover: File | null;
  gallery: File[];
  onCoverChange: (file: File | null) => void;
  onGalleryChange: (files: File[]) => void;
  maxGallery?: number;
  className?: string;
}

export function UploadDropzone({
  cover,
  gallery,
  onCoverChange,
  onGalleryChange,
  maxGallery = 6,
  className,
}: UploadDropzoneProps) {
  const coverInputRef = React.useRef<HTMLInputElement>(null);
  const galleryInputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  const coverPreview = useObjectUrl(cover);
  const galleryPreviews = useObjectUrls(gallery);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith("image/"));
    if (file) onCoverChange(file);
  }

  function handleGalleryPick(e: React.ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/"));
    const merged = [...gallery, ...incoming].slice(0, maxGallery);
    onGalleryChange(merged);
    // Reset so picking the same file twice in a row still fires `change`.
    e.target.value = "";
  }

  function removeGalleryAt(idx: number) {
    onGalleryChange(gallery.filter((_, i) => i !== idx));
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "relative h-[480px] rounded-2xl border-2 border-dashed bg-warm p-6 transition-colors",
        dragging ? "border-ink bg-warm/70" : "border-ink/20",
        className,
      )}
    >
      {/* Cover preview */}
      <div className="absolute inset-6 overflow-hidden rounded-lg" aria-hidden>
        {coverPreview ? (
          // We use a plain <img> here, not next/image: this is a local blob URL
          // that next/image can't optimise.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverPreview} alt="" className="size-full object-cover" />
        ) : null}
      </div>

      {/* Cover picker plate */}
      <div className="relative flex flex-col items-center justify-center gap-3 rounded-xl bg-surface/95 px-5 py-5 shadow-soft backdrop-blur-[2px]">
        <div className="flex size-14 items-center justify-center rounded-full bg-ink text-bg">
          <ImageIcon className="size-6" />
        </div>
        <div className="text-center">
          <div className="font-display text-[16px] font-semibold text-ink">
            {cover ? truncate(cover.name, 40) : "Drop your cover image"}
          </div>
          <div className="mt-1 text-[12.5px] text-muted">
            PNG, JPG, WEBP — up to 8MB · ideally 1000×1500 (vertical)
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => coverInputRef.current?.click()}
          >
            {cover ? "Replace" : "Choose file"}
          </Button>
          {cover && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onCoverChange(null)}
            >
              Remove
            </Button>
          )}
        </div>
        <input
          ref={coverInputRef}
          name="cover"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => onCoverChange(e.target.files?.[0] ?? null)}
        />
      </div>

      {/* Gallery row */}
      <div className="absolute inset-x-6 bottom-6 flex gap-2">
        {galleryPreviews.map((src, i) => (
          <div
            key={i}
            className="group relative h-16 flex-1 overflow-hidden rounded-md border border-line/10 bg-surface"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="size-full object-cover" />
            <button
              type="button"
              onClick={() => removeGalleryAt(i)}
              aria-label="Remove gallery image"
              className="absolute right-1 top-1 hidden size-5 items-center justify-center rounded-full bg-ink/85 text-bg group-hover:flex"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}

        {gallery.length < maxGallery && (
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="flex h-16 flex-1 items-center justify-center rounded-md border border-dashed border-line/15 bg-surface/70 text-muted hover:bg-surface"
            aria-label="Add gallery image"
          >
            <Plus className="size-5" />
          </button>
        )}

        <input
          ref={galleryInputRef}
          name="gallery"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={handleGalleryPick}
        />
      </div>
    </div>
  );
}

function truncate(s: string, max: number) {
  return s.length <= max ? s : `${s.slice(0, max - 1)}…`;
}

// ── object-url lifecycle hooks (revoke on unmount or change) ──────────────

function useObjectUrl(file: File | null): string | null {
  const [url, setUrl] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return url;
}

function useObjectUrls(files: File[]): string[] {
  const [urls, setUrls] = React.useState<string[]>([]);
  React.useEffect(() => {
    const next = files.map((f) => URL.createObjectURL(f));
    setUrls(next);
    return () => next.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);
  return urls;
}
