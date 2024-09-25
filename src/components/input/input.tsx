import clsx from 'clsx';
import React, { forwardRef } from 'react';

// InputProps
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  children?: React.ReactNode;
  error?: boolean;
}

// Input 컴포넌트
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ children, className = '', error, ...props }, ref) => {
    // 기본 클래스들
    const baseClasses =
      'w-full px-16 py-14 text-lg font-normal rounded-xl bg-background-secondary border border-background-tertiary text-text-primary font-font-normal';
    const placeholderClasses = 'placeholder-text-default text-lg font-normal';
    const focusClasses =
      'pl-16 focus:border-interaction-focus border focus:outline-none';

    const disabledClasses = props.disabled
      ? 'cursor-not-allowed placeholder-text-disabled focus:outline-none'
      : '';

    const errorClass = clsx({
      'border border-status-danger focus:border-status-danger': error,
    });

    // 전체 클래스명 생성
    const classNames = clsx(
      baseClasses,
      placeholderClasses,
      focusClasses,
      errorClass,
      disabledClasses,
      className,
    );

    return <input ref={ref} className={classNames} {...props} />;
  },
);

Input.displayName = 'Input';

// 타입 설정
export default Input;
