import clsx from 'clsx';

const Input = ({ className, ...rest }) => (
  <input
    className={clsx(
      'w-full border-2 border-ink bg-paper text-ink px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ink uppercase text-sm',
      className
    )}
    {...rest}
  />
);

export default Input;
