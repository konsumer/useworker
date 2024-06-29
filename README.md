# useWorker

This is a very simple react-hook for offloading work into another webworker-thread. It simplifies using web-workers, and doesn't require seperate JS files to define your worker.

Web workers have a slightly different API than plain browser stuff, so make sure to [read about them](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).

Main consideration is that you can only pass values that are ok (JSONable, no functions, errors, etc, but `File` and `Blob` and more is ok) and you use `postMessage` in your `onWork` function to fire the `onFinish`. You can post multiple times, and it will each fire `onFinish` on each.

Use this whenever you can benefit from putting work in another thread, on the web. Inside the `onWork` thread, you can do `fetch`, web-sockets, `OffscreenCanvas`, and lots more. Think of it as "`useEffect` on another thread."

## installation

```
npm i useworker
```

## usage

You can see an [example hook](./example/src/useResizeImage.js) where I resize uploaded images in a worker.

Basic idea is like this:

```js
// all params are optional

const doStuff = useWorker ({ onWork, onFinish, onError })

// onWork   - called as worker. It can be a string or a function. Must be self-contained. It gets it's input from event.data, and outputs with postMessage 
// onFinish - host-side, called when worker does a postMessage
// onError  - host-side, called when worker has an error

// call doStuff when you want to do work, it will send input arg as event.data
```
