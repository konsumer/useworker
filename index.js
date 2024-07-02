/* global Worker */

import { useRef, useEffect } from 'react'

const noop = () => {}
export default function useWorker ({ onWork = noop, onFinish = noop, onError = noop }, deps = [], options = { type: 'module' }) {
  const worker = useRef()
  let url
  useEffect(() => {
    if (onWork instanceof Worker) {
      worker.current = onWork
    } else {
      url = window.URL.createObjectURL(new Blob([`self.onmessage = ${onWork.toString()}`], { type: 'text/javascript' }))
      worker.current = new Worker(url, options)
    }
    worker.current.onmessage = e => onFinish(e.data)
    worker.current.onerror = onError
    return () => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url)
      }
      if (worker.current) {
        worker.current.terminate()
      }
    }
  }, deps)
  return (data) => worker.current?.postMessage && worker.current.postMessage(data)
}
