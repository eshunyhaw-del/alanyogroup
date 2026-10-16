type Props = React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string };

const control =
  "mt-2 w-full border-0 border-b border-ink/30 bg-transparent px-0 py-3 text-[15px] font-light outline-none transition-colors focus:border-ink";

export function Field({ label, hint, id, ...rest }: Props) {
  const fid = id ?? rest.name;
  return (
    <div>
      <label htmlFor={fid} className="text-[11px] font-medium uppercase tracking-[0.2em] text-warm">
        {label}
        {rest.required && <span aria-hidden> *</span>}
      </label>
      <input id={fid} className={control} {...rest} />
      {hint && <p className="mt-2 text-[12px] text-warm">{hint}</p>}
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
