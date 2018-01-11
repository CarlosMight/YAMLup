# yamlup

![YAMLup](/static/img/favicon.png)

> A sandbox for data visualization.

## Prereqs
- Install [NodeJS](https://nodejs.org/en/download/)
  - Needed to run the app locally
- Install [Firebase CLI](https://firebase.google.com/docs/cli/) with `npm install -g firebase-tools`

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Firebase Setup
If you haven't already, you'll need to create a [Firebase project](https://firebase.google.com/). You'll then want to copy your projects config settings into `/src/config/firebase.json`

![Screenshot from 2018-01-10 20-08-36.png](/docs/Screenshot from 2018-01-10 20-08-36.png "Example Config")

You'll also need to:
- Enable Twitter authentication
- Enable Firestore as your database (vs the classic Firebase db)

I don't anticipate anyone actually building this for some time, so ask for clearer instructions or star the repo and I'll update these!

## Deploying
Deploy to your server with `firebase deploy`. If you're using our server, you won't be able to deploy so make sure to configure your environment!
