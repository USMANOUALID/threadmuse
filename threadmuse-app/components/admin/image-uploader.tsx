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

    if (!(file instanceof File) || file.size === 0) {
      setStatus("Choose an image first.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const extension = file.name.split(".").pop() ?? "png";
      const path = `cms/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from("cms-media").upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      });

      if (error) {
        setStatus(error.message);
        return;
      }

      const { data } = supabase.storage.from("cms-media").getPublicUrl(path);
      setUrl(data.publicUrl);
      setStatus("Upload complete. Public URL generated.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-line/10 bg-bg p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <ImagePlus className="size-5" />
        </span>
        <div>
          <h3 className="font-display text-xl font-semibold">Image uploader</h3>
          <p className="text-sm text-muted">Uploads to the Supabase `cms-media` storage bucket.</p>
        </div>
      </div>
      <input
        required
        name="file"
        type="file"
        accept="image/*"
        className="mt-5 w-full rounded-xl border border-line/10 bg-surface p-3 text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
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
