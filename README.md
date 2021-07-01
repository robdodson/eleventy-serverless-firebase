# Eleventy Serverless on Firebase

## Setup

- Change the project name in `.firebaserc` to your Firebase project's name.
- Run `npm i` in both the root directory, and in the `./functions/possum/` directory.
- From the root directory, run `npm run dev`.
- Open `http://localhost:5001/PROJECT_ID/PROJECT_REGION/handler` in the browser. For example: `http://localhost:5001/eleventy-firebase/us-central1/handler`.

## Important changes

In `firebase.json` I changed the functions source directory to `./functions/possum`. This is because the `EleventyServerlessBundlerPlugin` has a `name` argument, which it assumes is the name of your function subdirectory and it uses that to copy over a bunch of files. But by default, firebase functions just have an `index.js` in the `/functions/` directory that defines all of the handlers. So we need to set up our functions directory so it's similar to how Netlify does things.

Your function needs to be called `exports.handler`. In many firebase examples, the function can be whatever name you want (e.g. `exports.helloWorld`). But I think Eleventy will try to explicitly require and then call `.handler()` on your function.

Firebase function projects usually have two `node_modules` directories (one for the root project, and one in the functions directory). Because we're changing the structure of the functions directory to be like Netlify, we need to move our function's `package.json`, `package-lock.json`, and `node_modules` into the `possum` subdirectory.

Instead of [the gitignore that the docs recommend](https://www.11ty.dev/docs/plugins/serverless/#step-2-add-to-.gitignore) I use this one so we don't ignore our package.json files:

```
functions/possum/*
!functions/possum/index.js
!functions/possum/package.json
!functions/possum/package-lock.json
```

## TODO

### Long url
Currently the function path is really long:

```
http://localhost:5001/eleventy-firebase/us-central1/handler
```

I think doing the rewrites configuration mentioned in [these docs](https://firebase.google.com/docs/hosting/functions#direct-requests-to-function), but it didn't seem to work. I suspect this isn't working because I changed the functions source directory but I'm not sure 🤷‍♂️

### npm script runs eleventy twice
We want eleventy to run once to completion before we start the firebase emulator. But we also want to use `eleventy --watch` to watch for changes. Unfortunately `eleventy --watch` will _also_ do an eleventy build the first time it is run, so this means the `npm run dev` command actually runs eleventy twice. I think `eleventy --watch` should have an `--ignore-initial` flag (Chokidar supports this but it doesn't seem to pass through to `eleventy --watch`. [Vote for my issue!](https://github.com/11ty/eleventy/issues/1336)

## Issues

🚨 The _data directory does not seem to work. If I do a static build I can see the `userList` gets rendered. But when the function renders the page, the `userList` does not get rendered.

Eleventy doesn't seem to clean up after itself when it copies stuff over to the functions directory. 