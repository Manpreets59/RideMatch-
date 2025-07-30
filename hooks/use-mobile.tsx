import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    checkMobile()
    mql.addEventListener("change", checkMobile)
    window.addEventListener("resize", checkMobile)

    return () => {
      mql.removeEventListener("change", checkMobile)
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return isMobile
}
