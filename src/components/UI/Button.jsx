import clsx from 'clsx';

const base =
  'inline-flex items-center justify-center gap-2 h-10 px-4 border-2 border-ink bg-paper text-ink hover:bg-ink hover:text-paper transition-colors uppercase tracking-wide text-xs';

const Button = ({ children, className, ...rest }) => (
  <button type="button" className={clsx(base, className)} {...rest}>
    {children}
  </button>
);

export default Button;
