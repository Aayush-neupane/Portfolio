import { useScrollProgress } from '../hooks/useScrollProgress'

export default function ScrollProgress() {
  const progressRef = useScrollProgress()
  return <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
}
