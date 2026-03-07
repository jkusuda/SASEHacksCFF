export default function Title({ children, className = "", as: Component = "h1", mono = false, ...props }) {
  const fontClass = mono ? "font-mono" : "font-sans";
  const baseClass = "font-black tracking-tight text-balance";
  const sizeClass = "text-[clamp(80px,10vw,140px)]";

  return (
    <Component
      className={`${fontClass} ${baseClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
