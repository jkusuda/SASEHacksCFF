export default function Subheading({ children, className = "", as: Component = "h3", mono = false, ...props }) {
  const fontClass = mono ? "font-mono" : "font-sans";
  const baseClass = "font-normal tracking-tight text-balance";
  const sizeClass = "text-[clamp(1rem,2vw+0.75rem,1.875rem)]";

  return (
    <Component
      className={`${fontClass} ${baseClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
