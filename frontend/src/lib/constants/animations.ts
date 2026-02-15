import { easeInOut, easeOut } from "framer-motion"

export const TRANSITIONS = {
  ease: easeOut,
  duration: 0.3
}

export const SPRING = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25
}

export const HOVER_SPRING = {
  type: "spring" as const,
  stiffness: 500,
  damping: 15
}

export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 }
} 