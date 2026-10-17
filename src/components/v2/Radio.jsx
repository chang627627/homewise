import React, { useRef } from 'react';

// One radio row. Keyboard focus shows as an outline around the circle, the
// way a native radio draws it, so the row text keeps its alignment.
export const Radio = React.forwardRef(function Radio({ checked, on, disabled = false, children, className = '', ...rest }, ref) {
  const isOn = !!(checked ?? on);
  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={isOn}
      disabled={disabled}
      {...rest}
      className={`group flex h-8 items-center gap-2.5 text-left text-ui tabular-nums text-ink-900 focus-visible:outline-none disabled:opacity-40 disabled:pointer-events-none ${className}`}
    >
      <span
        className={`h-4 w-4 shrink-0 rounded-full bg-white outline-2 outline-offset-2 outline-ink-900/25 transition-[box-shadow] duration-150 group-focus-visible:outline
          ${isOn ? 'ring-[5px] ring-inset ring-ink-900' : 'ring-1 ring-inset ring-ink-300'}`}
      />
      {children}
    </button>
  );
});

// WAI-ARIA radio group: one tab stop (the checked radio, else the first);
// arrows move focus and select, wrapping; Home and End jump to the ends.
// options: [{ value, label, disabled? }]
export function RadioGroup({ value, onChange, options, label, labelledBy, disabled = false, className = '' }) {
  const refs = useRef([]);
  const enabled = options.map((o, i) => (!disabled && !o.disabled ? i : -1)).filter((i) => i >= 0);
  const checkedIndex = options.findIndex((o) => o.value === value);
  const tabStop = enabled.includes(checkedIndex) ? checkedIndex : enabled[0];

  const select = (i) => {
    refs.current[i]?.focus();
    if (options[i].value !== value) onChange?.(options[i].value);
  };

  const onKeyDown = (e, i) => {
    const pos = enabled.indexOf(i);
    if (pos < 0) return;
    let next = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = enabled[(pos + 1) % enabled.length];
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = enabled[(pos - 1 + enabled.length) % enabled.length];
    else if (e.key === 'Home') next = enabled[0];
    else if (e.key === 'End') next = enabled[enabled.length - 1];
    if (next == null) return;
    e.preventDefault();
    select(next);
  };

  return (
    <div role="radiogroup" aria-label={labelledBy ? undefined : label} aria-labelledby={labelledBy} aria-disabled={disabled || undefined} className={`flex flex-col items-start ${className}`}>
      {options.map((o, i) => (
        <Radio
          key={o.value}
          ref={(n) => {
            refs.current[i] = n;
          }}
          checked={o.value === value}
          disabled={disabled || o.disabled}
          tabIndex={i === tabStop ? 0 : -1}
          onClick={() => select(i)}
          onKeyDown={(e) => onKeyDown(e, i)}
        >
          {o.label}
        </Radio>
      ))}
    </div>
  );
}

export default Radio;
