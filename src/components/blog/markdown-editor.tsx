"use client";

import { useMemo, useRef, useState, type ClipboardEvent } from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { MdxPreview } from "./mdx-preview";
import { MediaUploadDialog } from "./media-upload-dialog";
import { MediaPickerDialog } from "./media-picker-dialog";
import { commands as md_commands, type ICommand } from "@uiw/react-md-editor";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  on_change: (value: string) => void;
  height?: number;
}

async function upload_pasted_image(file: File): Promise<string | null> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload-image", { method: "POST", body: form });
  if (!res.ok) return null;
  const data = (await res.json()) as { path?: string };
  return data.path ?? null;
}

export function MarkdownEditor({ value, on_change, height = 600 }: MarkdownEditorProps) {
  const value_ref = useRef(value);
  value_ref.current = value;
  const wrapper_ref = useRef<HTMLDivElement>(null);
  const [uploading, set_uploading] = useState(false);
  const [error, set_error] = useState("");
  const [preview_visible, set_preview_visible] = useState(true);
  const [upload_open, set_upload_open] = useState(false);
  const [picker_open, set_picker_open] = useState(false);

  const upload_command = useMemo<ICommand>(
    () => ({
      name: "upload-image",
      keyCommand: "upload-image",
      buttonProps: {
        "aria-label": "Upload image from file",
        title: "Upload image from file",
      },
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
      execute: () => {
        set_upload_open(true);
      },
    }),
    []
  );

  const pick_command = useMemo<ICommand>(
    () => ({
      name: "pick-image",
      keyCommand: "pick-image",
      buttonProps: {
        "aria-label": "Pick image from library",
        title: "Pick image from library",
      },
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      execute: () => {
        set_picker_open(true);
      },
    }),
    []
  );

  const editor_commands = useMemo<ICommand[]>(() => {
    const defaults = md_commands.getCommands();
    const image_index = defaults.findIndex((c) => c.name === "image");
    if (image_index < 0) return [...defaults, upload_command, pick_command];
    const next = [...defaults];
    next.splice(image_index + 1, 0, upload_command, pick_command);
    return next;
  }, [upload_command, pick_command]);

  function insert_image_markdown(path: string) {
    const textarea = wrapper_ref.current?.querySelector<HTMLTextAreaElement>(
      ".w-md-editor-text-input"
    );
    const snippet = `![](${path})`;
    const current = value_ref.current;
    if (!textarea) {
      on_change(current + (current.endsWith("\n") || current === "" ? "" : "\n") + snippet + "\n");
      return;
    }
    const start = textarea.selectionStart ?? current.length;
    const end = textarea.selectionEnd ?? start;
    const before = current.slice(0, start);
    const after = current.slice(end);
    on_change(before + snippet + after);
  }

  async function handle_paste(e: ClipboardEvent<HTMLTextAreaElement>) {
    const items = e.clipboardData?.items;
    if (!items) return;

    const image_item = Array.from(items).find(
      (it) => it.kind === "file" && it.type.startsWith("image/")
    );
    if (!image_item) return;

    const file = image_item.getAsFile();
    if (!file) return;

    e.preventDefault();
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = value_ref.current;

    const placeholder = `![uploading…]()`;
    const before = current.slice(0, start);
    const after = current.slice(end);
    on_change(before + placeholder + after);

    set_uploading(true);
    set_error("");
    try {
      const path = await upload_pasted_image(file);
      if (!path) {
        set_error("Upload failed.");
        on_change(before + after);
        return;
      }
      on_change(before + `![](${path})` + after);
    } catch {
      set_error("Upload failed.");
      on_change(before + after);
    } finally {
      set_uploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">
          Paste images directly, use the upload button in the toolbar, or pick one from your library.
        </span>
        <button
          type="button"
          onClick={() => set_preview_visible((v) => !v)}
          className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
        >
          {preview_visible ? "Hide preview" : "Show preview"}
        </button>
      </div>

      <div className="flex gap-4" data-color-mode="light" ref={wrapper_ref}>
        <div className={preview_visible ? "flex-1 min-w-0" : "w-full"}>
          <MDEditor
            value={value}
            onChange={(v) => on_change(v ?? "")}
            height={height}
            preview="edit"
            visibleDragbar={false}
            commands={editor_commands}
            textareaProps={{
              placeholder: "Write your post content in Markdown/MDX…",
              onPaste: handle_paste,
            }}
          />
        </div>
        {preview_visible && (
          <div
            className="flex-1 min-w-0 overflow-auto rounded-md border border-gray-200 bg-white p-6"
            style={{ height }}
          >
            <MdxPreview source={value} />
          </div>
        )}
      </div>

      {uploading && <p className="text-xs text-gray-500 mt-2">Uploading image…</p>}
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      <MediaUploadDialog
        open={upload_open}
        on_close={() => set_upload_open(false)}
        on_uploaded={(result) => {
          insert_image_markdown(result.path);
        }}
      />

      <MediaPickerDialog
        open={picker_open}
        on_close={() => set_picker_open(false)}
        on_pick={(result) => {
          insert_image_markdown(result.path);
        }}
      />
    </div>
  );
}
