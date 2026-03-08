export default function Subheading({ children, className = "", as: Component = "h3", mono = false, ...props }) {
  const fontClass = mono ? "font-mono" : "font-sans";
  const baseClass = "font-normal tracking-tight text-balance";
  const sizeClass = "text-[clamp(0.9375rem,1.5vw+0.6rem,1.5rem)]";

  return (
    <Component
      className={`${fontClass} ${baseClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
