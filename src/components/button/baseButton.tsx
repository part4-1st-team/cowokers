import clsx from 'clsx';

type ColorType = 'primary' | 'outlined' | 'outlinedSecon' | 'red' | 'bgNon';
type ButtonType = 'button' | 'submit' | 'reset';

interface BaseButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  color?: ColorType;
  disabled?: boolean;
  type?: ButtonType; // 선택적 속성으로 수정
  text: string; // 텍스트만 받는 방식
  className?: string; // 추가적인 커스텀 클래스 네임
}

/**
 * `BaseButton` 컴포넌트는 다양한 스타일과 기능을 제공하는 버튼입니다.
 * 버튼의 색상, 크기, 상태를 prop을 통해 조절할 수 있습니다.
 *
 * @param {string} text - 버튼에 표시될 텍스트입니다.
 * @param {ColorType} [color='primary'] - 버튼의 색상 스타일을 지정합니다. 선택 가능한 값은 'primary', 'outlined', 'outlinedSecon', 'red', 'bgNon'입니다.
 * @param {ButtonType} [type='button'] - 버튼의 HTML 타입을 지정합니다. 기본값은 'button'이며, 'submit' 또는 'reset'으로 변경할 수 있습니다.
 * @param {boolean} [disabled=false] - 버튼을 비활성화할지 여부를 결정합니다. 기본값은 `false`입니다.
 * @param {string} [className] - 버튼에 추가적인 CSS 클래스를 지정할 수 있습니다.
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props - HTML button 요소의 나머지 속성들입니다.
 *
 * @example
 * ```tsx
 * <BaseButton
 *   type="button"
 *   text="생성하기"
 *   color="primary"
 *   className="w-332 h-32"
 * />
 * ```
 *
 * @returns {JSX.Element} - `BaseButton` 컴포넌트를 반환합니다.
 */
function BaseButton({
  color = 'primary',
  text,
  type = 'button', // 기본값 설정
  disabled = false,
  className,
  ...props
}: BaseButtonProps) {
  const baseButton =
    'w-full text-md font-semibold text-text-inverse px-12 py-7.5 flex items-center justify-center rounded-12 ';

  const colorStyle = {
    primary:
      'bg-brand-primary hover:bg-interaction-hover focus:outline-none focus:bg-interaction-pressed disabled:bg-interaction-inactive',
    outlined:
      'bg-background-inverse text-brand-secondary border border-brand-primary hover:text-interaction-hover hover:border-interaction-hover focus:border-interaction-pressed focus:text-interaction-pressed disabled:border-interaction-inactive disabled:text-interaction-inactive',
    // text-brand-primary 색상이 적용이 안되는 이유를 못찾았습니다. 임시로 text-brand-secondary 사용
    outlinedSecon:
      'bg-background-inverse text-text-default border border-text-secondary',
    // text-brand-primary 색상이 적용이 안되는 이유를 못찾았습니다. 임시로 text-brand-secondary 사용
    red: 'bg-status-danger text-text-inverse',
    bgNon:
      'bg-none text-brand-secondary border border-brand-primary hover: hover:border-interaction-hover hover:text-interaction-hover active:text-interaction-pressed disabled:border-interaction-inactive disabled:text-interaction-inactive',
  };

  const buttonClass = clsx(baseButton, colorStyle[color], className);

  return (
    // eslint-disable-next-line react/button-has-type
    <button type={type} disabled={disabled} className={buttonClass} {...props}>
      {text}
    </button>
  );
}

BaseButton.defaultProps = {
  color: 'primary',
  disabled: false,
  type: 'button',
  className: '',
};

export default BaseButton;
