
function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary:
      "bg-rose-400 text-white hover:bg-rose-500",

    secondary:
      "bg-rose-100 text-rose-700 hover:bg-rose-200",

    outline:
      "border border-rose-200 bg-white text-rose-700 hover:bg-rose-50",

    danger:
      "bg-red-100 text-red-700 hover:bg-red-200",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
