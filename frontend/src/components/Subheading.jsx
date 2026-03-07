export default function Subheading({ children, className = "", as: Component = "h3", mono = false, ...props }) {
  const fontClass = mono ? "font-mono" : "font-sans";
  const baseClass = "font-normal tracking-tight text-balance";
  const sizeClass = "text-xl sm:text-2xl md:text-3xl";

  return (
    <Component
      className={`${fontClass} ${baseClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
