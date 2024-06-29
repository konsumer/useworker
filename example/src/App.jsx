import { useState } from 'react'
import useResizeImage from './useResizeImage.js'
import IconError from './IconError.jsx'

export default function PageExample () {
  const [url, setUrl] = useState()
  const [error, setError] = useState()

  // when the worker returns from resizing to 100x100, set url-var, on error set error-var
  const resizeImage = useResizeImage(u => setUrl(u), e => setError(e.message))

  // this is my file-input callback that will send the image file-object to the worker
  const handleFileChange = ({ target: { files } }) => {
    // clear old object-URL
    if (url) {
      URL.revokeObjectURL(url)
    }
    resizeImage(files[0])
  }

  return (
    <main className='m-auto p-4 prose dark:prose-invert lg:prose-xl'>
      <h1>useWorker</h1>
      <p>This is a simple example of <a href='https://github.com/konsumer/useworker'>useWorker</a>.</p>
      <p>Upload an image, and it will resize it for you. Here is <a href='https://github.com/konsumer/useworker/tree/main/example'>the source</a>.</p>
      {error && (
        <div role='alert' className='alert alert-error flex mb-4'>
          <IconError />
          <span>Error! {error}</span>
        </div>
      )}
      <input type='file' className='file-input file-input-bordered file-input-secondary w-full max-w-xs' onChange={handleFileChange} />
      {url && <img src={url} />}
    </main>
  )
}
