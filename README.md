# Nombook: the open source, social recipe manager

[ ![Codeship Status for jefferyshivers/Nombook](https://app.codeship.com/projects/307d8b60-a2fe-0135-6a40-0e3370c2291d/status?branch=master)](https://app.codeship.com/projects/254833)

## About

[Nombook](http://nombook.com) is my answer to a craving for a better experience creating, sharing and discovering recipes.

With Nombook, you can create beautiful recipes styled with rich text. You can like your favorite recipes, search for other users in a responsive search bar, and follow friends to keep track of their latest recipes in your home feed.

One of Nombook's most special features is its forking functionality, which means that you can copy the directions from any existing recipe and change them the way you want as a whole new recipe, while giving credit and providing a convenient reference to the original recipe that inspired it.

### Tools

Nombook is made up of a carefully crafted blend of React, Redux, DraftJS, Rails and PostgreSQL, plus so many other awesome open source tools.

## Running it Yourself

If you have yarn and rails installed, the only additional tools you'll need are PostgreSQL and ImageMagick.

```
# if you don't have them already:
brew install postgresql
brew install imagemagick

# in the root directory
bundle
yarn install

```

The most important configurations to note:

- Ruby 2.3.3
- Rails 5.0
- React 16
- React Router 4.2.2^
- Redux 3, react-redux 5
- DraftJS 0.10.4
- ImageMagick
- PostgreSQL

You'll need to also set environment variable for AWS S3 buckets () in order to upload files in development/production, or set dummy values if you aren't going to use that feature, OR refactor the code in `/app/uploaders/*.rb` to upload to `storage :file` regardless of environment. That puts uploads in the `/public/uploads` directory.

To serve it up:

```
rails s
# and in another tab:
yarn start
```

## Contribute

Are there any features you wish Nombook had that it doesn't? Submit an issue in the issue tracker!

If you would like to contribute as a developer, feel free to fork and submit a PR.