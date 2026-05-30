"use client";

import * as React from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function ImageUploader() {
  const [status, setStatus] = React.useState<string>("Ready to upload CMS media.");
  const [loading, setLoading] = React.useState(false);
  const [url, setUrl] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("Uploading...");

    const form = new FormData(event.currentTarget);
    const file = form.get("file");
    const altText = String(form.get("alt_text") ?? "");

    if (!(file instanceof File) || file.size === 0) {
      setStatus("Choose an image first.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "png";
      const path = `cms/${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from("cms-media").upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });

      if (error) {
        setStatus(error.message);
        return;
      }

      const { data } = supabase.storage.from("cms-media").getPublicUrl(path);
      const { error: insertError } = await supabase.from("media_assets").insert({
        bucket: "cms-media",
        storage_path: path,
        public_url: data.publicUrl,
        alt_text: altText || file.name.replace(/\.[^.]+$/, ""),
        mime_type: file.type,
        size_bytes: file.size,
      });

      if (insertError) {
        setStatus(`Uploaded but could not register asset: ${insertError.message}`);
        return;
      }

      setUrl(data.publicUrl);
      setStatus("Upload complete and media asset registered.");
      event.currentTarget.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-line/10 bg-surface p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <ImagePlus className="size-5" />
        </span>
        <div>
          <h3 className="font-display text-xl font-semibold">Image uploader</h3>
          <p className="text-sm text-muted">Uploads to Supabase Storage and registers the asset in `media_assets`.</p>
        </div>
      </div>
      <label className="mt-5 grid gap-2 text-sm font-medium">
        Alt text
        <input
          name="alt_text"
          placeholder="Describe the image for accessibility and SEO"
          className="rounded-xl border border-line/10 bg-bg px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </label>
      <input
        required
        name="file"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="mt-4 w-full rounded-xl border border-line/10 bg-bg p-3 text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
      />
      <Button type="submit" className="mt-4 w-full" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        Upload image
      </Button>
      <p className="mt-3 text-sm text-muted">{status}</p>
      {url && (
        <a href={url} className="mt-2 block break-all text-sm text-accent" target="_blank" rel="noreferrer">
          {url}
        </a>
      )}
    </form>
  );
}
