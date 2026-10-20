type Props = React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string };

const control =
  "mt-2 w-full border-0 border-b border-ink/30 bg-transparent px-0 py-3 text-[15px] font-light outline-none transition-colors focus:border-ink";

export function Field({ label, hint, error, id, ...rest }: Props) {
  const fid = id ?? rest.name;
  return (
    <div>
      <label htmlFor={fid} className="text-[11px] font-medium uppercase tracking-[0.2em] text-warm">
        {label}
        {rest.required && <span aria-hidden> *</span>}
      </label>
      <input
        id={fid}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fid}-error` : undefined}
        className={control}
        {...rest}
      />
      {error ? (
        <p id={`${fid}-error`} role="alert" className="mt-2 text-[12px] text-ink">
          {error}
        </p>
      ) : (
        hint && <p className="mt-2 text-[12px] text-warm">{hint}</p>
      )}
    </div>
  );
}

export function TextArea({
  label,
  id,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const fid = id ?? rest.name;
  return (
    <div>
      <label htmlFor={fid} className="text-[11px] font-medium uppercase tracking-[0.2em] text-warm">
        {label}
        {rest.required && <span aria-hidden> *</span>}
      </label>
      <textarea id={fid} rows={4} className={`${control} resize-y`} {...rest} />
    </div>
  );
}

export function Select({
  label,
  id,
  options,
  error,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[]; error?: string }) {
  const fid = id ?? rest.name;
  return (
    <div>
      <label htmlFor={fid} className="text-[11px] font-medium uppercase tracking-[0.2em] text-warm">
        {label}
        {rest.required && <span aria-hidden> *</span>}
      </label>
      <select
        id={fid}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fid}-error` : undefined}
        className={`${control} appearance-none`}
        {...rest}
      >
        <option value="">Choose…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${fid}-error`} role="alert" className="mt-2 text-[12px] text-ink">
          {error}
        </p>
      )}
    </div>
  );
}
