import {
  HugeiconsIcon as HugeiconsRenderer,
  type HugeiconsIconProps,
} from "@hugeicons/react";

export function DecorativeIcon(props: HugeiconsIconProps) {
  return <HugeiconsRenderer {...props} aria-hidden="true" focusable="false" />;
}
