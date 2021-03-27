import { pipe } from "fp-ts/function"
import { map } from "fp-ts/ReadonlyArray"
import { left } from "fp-ts/Separated"
import { useThree } from "react-three-fiber"
import { width, height } from "tailwindcss/defaultTheme"

export const useXYAdjust = () => {
  const {
    viewport: { width, height, factor, distance },
    size,
  } = useThree()

  const [left, top] = [size.left, size.top].map((v) => v / factor)

  return (xy: [number, number]) =>
    pipe(
      xy,
      map((v) => v / factor),
      ([x, y]) => [x - (width / 2 + left), -1 * y + (height / 2 + top)]
    )
}

export default useXYAdjust
