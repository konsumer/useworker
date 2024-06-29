/* global Worker */

import { useRef, useEffect } from 'react'

const noop = () => {}
export default function useWorker ({ onWork = noop, onFinish = noop, onError = noop }, deps = []) {
  const worker = useRef()
  useEffect(() => {
    const url = window.URL.createObjectURL(new Blob([`self.onmessage = ${onWork.toString()}`], { type: 'text/javascript' }))
    worker.current = new Worker(url, { type: 'module' })
    worker.current.onmessage = e => onFinish(e.data)
    worker.current.onerror = onError
    return () => {
      URL.revokeObjectURL(url)
      if (worker.current) {
        worker.current.terminate()
      }
    }
  }, deps)
  return (data) => worker.current?.postMessage && worker.current.postMessage(data)
}
