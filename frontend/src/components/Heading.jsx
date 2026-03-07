export default function Heading({ children, className = "", as: Component = "h2", mono = false, ...props }) {
  const fontClass = mono ? "font-mono" : "font-sans";
  const baseClass = "font-semibold tracking-tight text-balance";
  const sizeClass = "text-2xl sm:text-3xl md:text-4xl";

  return (
    <Component
      className={`${fontClass} ${baseClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
