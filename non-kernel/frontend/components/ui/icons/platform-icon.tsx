import { ICON_MAP, ICON_STYLES, IconType } from './icon-map';

type IconSize = keyof typeof ICON_STYLES;

type PlatformIconProps = {
  type: IconType;
  className?: string;
  size?: IconSize;
};

const DEFAULT_SIZE: IconSize = 'md';
const DEFAULT_SIZE_CLASS = 'h-5 w-5';

export function PlatformIcon({
  type,
  className,
  size = DEFAULT_SIZE,
}: PlatformIconProps) {
  const Icon = ICON_MAP[type];

  if (!Icon) {
    return null;
  }

  const defaultSize = ICON_STYLES[size] ?? DEFAULT_SIZE_CLASS;

  return <Icon className={className ?? defaultSize} />;
}
