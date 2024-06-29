// a react-hook that will resize images in a worker

// normally this would be @konsumer/useworker
import useWorker from '../../index.js'

// dummy function for callback-defaults
const noop = () => {}

// this is a reusable worker-hook
export const useResizeImage = (onSuccess = noop, onError = noop, size = [100, 100], options = {}, mimeType = 'image/png', quality) => {
  // this will be called in the worker
  // I am using a string here, to get around vite mangling import
  const onWork = `async event => {
    const { file, size: [w, h], options, mimeType, quality } = event.data

    // get the file as ImageBitmap
    const u = URL.createObjectURL(file)
    const from = await createImageBitmap(await fetch(u).then(r => r.blob()))
    URL.revokeObjectURL(u)

    // setup output canvas
    const to = new OffscreenCanvas(w, h)

    // use pica to resize: https://github.com/nodeca/pica
    const pica = (await import('https://esm.sh/pica')).default({ createCanvas: (w, h) => new OffscreenCanvas(w, h) })
    const b = await pica.resize(from, to, options).then(r => pica.toBlob(r, mimeType, quality))

    // send the URL back to host's onSuccess()
    postMessage(URL.createObjectURL(b))
  }`

  const w = useWorker({
    onFinish: onSuccess,
    onError,
    onWork
  })

  // this function is called in host-space to pass options to the worker
  return file => w({ file, size, options, mimeType, quality })
}

export default useResizeImage
