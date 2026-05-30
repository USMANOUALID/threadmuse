import { stringifyField } from "@/lib/admin/cms-data";
import type { CmsField } from "@/lib/admin/cms-config";

export function CmsFieldControl({
  field,
  value,
  forceReadonly = false,
}: {
  field: CmsField;
  value: unknown;
  forceReadonly?: boolean;
}) {
  const readonly = field.readonly || forceReadonly;
  const stringValue = stringifyField(value);
  const commonClass = "rounded-xl border border-line/10 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent disabled:opacity-70";

  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      <span className="flex items-center justify-between gap-3">
        {field.label}
        {field.required && <span className="text-xs text-accent">Required</span>}
      </span>
      {field.type === "textarea" || field.type === "json" || field.type === "array" ? (
        <textarea
          name={field.name}
          rows={field.type === "json" ? 8 : 5}
          defaultValue={stringValue}
          required={field.required}
          readOnly={readonly}
          placeholder={field.placeholder}
          className={`${commonClass} resize-y font-${field.type === "json" ? "mono" : "sans"}`}
        />
      ) : field.type === "boolean" ? (
        <span className="flex items-center gap-3 rounded-xl border border-line/10 bg-bg px-4 py-3 text-sm text-muted">
          <input
            name={field.name}
            type="checkbox"
            defaultChecked={Boolean(value)}
            disabled={readonly}
            className="size-4 accent-red-500"
          />
          Enabled
          {readonly && <input type="hidden" name={field.name} value={Boolean(value) ? "on" : ""} />}
        </span>
      ) : field.type === "select" ? (
        <>
          <select
            name={field.name}
            defaultValue={stringValue}
            required={field.required}
            disabled={readonly}
            className={commonClass}
          >
            <option value="">Select...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {readonly && <input type="hidden" name={field.name} value={stringValue} />}
        </>
      ) : (
        <input
          name={field.name}
          type={field.type === "datetime" ? "datetime-local" : field.type}
          defaultValue={field.type === "datetime" && stringValue ? stringValue.slice(0, 16) : stringValue}
          required={field.required}
          readOnly={readonly}
          placeholder={field.placeholder}
          className={commonClass}
        />
      )}
      {field.help && <span className="text-xs leading-5 text-muted">{field.help}</span>}
    </label>
  );
}
