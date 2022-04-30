const fadeInOut = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.1 } },
}

const pageInOut = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, staggerChildren: 0.2 },
  },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
}

export { fadeInOut, pageInOut }
