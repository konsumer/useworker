This is a very simple hook for offloading work into another webworker thread. It simplifies using web-workers, and doesn't require seperate JS files to define your worker.

Web workers havve a slightly different API than plain browser stuff, so make sure to [read about them](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).

Main consideration is that you can only pass values that are ok (JSONable, no functions, errors, etc, but `File` is ok) and you use `self.postMessage` in your `onWork` function to fire the `onFinish`. You can post multiple times, and it will each fire `onFinish` on each.

Use this whenever you can benefit from putting work in another thread, on the web. Inside the `onWork` thread, you can do `fetch`, web-sockets, `OffscreenCanvas`, and lots more.

## installation

```
npm i useworker
```

## usage

Imagine I had a form with a file-upload-field, and I want to resize images and show them. You can see an [example hook](./example/src/useResizeImage.js) for this, or see it running live [here](https://konsumer.js.org/useworker).

It's a bit of a simple example, but a worker can really help with complex image-processing, or multi-stage data-aqcuisition.