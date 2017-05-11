# Popup Study

The idea behind the Popup Study app is provide a platform through which studnents can easily match with each other based on their interests and needs.

The project is two-fold. On one hand, there is the matching logic. How to match people with posts that are the most relevant to them? What kind of data is at our disposal, and what kind do we need on top? On the other hand is the User Experience. How do we optimize the user flow through the app to improve its usability and effectiveness?

This document is a report of my experience building a prototype of the app.

## The technology

### React Native

The app was first thought of as a mobile web app, accessible from the browser app of a mobile phone. However, I chose to go with [React Native](http://facebook.github.io/react-native/) instead for two main reasons.

First and foremost, I was much more interested in the platform that React Native provides. I've built quite a few websites and apps for the web, but React Native provides an environment that is much more controlled: you know exactly where and how your app will run, and you control the framework it runs on. As such, there is little to no need to worry about which features the current platform supports. The ecosystem around React Native is currently booming, with a lot of exciting libraries and components being built around it.

The second motive behind my choice was to provide an all around better experience for the end user. Sadly, the mobile web is still in a bad shape when it comes to User Experience, and it is very complex to attain the "native feel" that users have come to expect.

### Expo

However, not everything about React Native is perfect. Having used it to some extent in the past, I had some issues with setting up native dependencies as well as upgrading the framework to newer versions – new releases are very frequent, and some are more painful than others. As such, I chose to try out [Expo](https://expo.io/), which smoothes out a lot of these issues by hiding much of the React Native configuration, and providing you with sane defaults and native dependencies pre-installed.

Starting with Expo was really quick, and the default boilerplate is already a good basis on which to build an app. Overall, I would say that Expo saved me some time, even though I eventually ran into stability issues with the Expo packager. The idea is great but the execution is slightly lacking.

### ex-navigation

Navigation is a complex problem, maybe moreso on mobile than on the web. There are a lot of navigation libraries for React Native, but as of right now, one is emerging as the community standard: [react-navigation](https://github.com/react-community/react-navigation). However, I chose to go with [ex-navigation](https://github.com/expo/ex-navigation) as it came bundled with React Native and I didn't want to deal with a beta release.

Ex-navigation makes it easy to declare the different transitions between views in your app, and works quite well for simple uses. For more advanced effects, one will need to develop their own solution around it. The biggest issue I had with it was that the documentation around the library is pretty much non-existant, so I had to dig into the code and the examples to understand how to use it. Another issue was the performance, which is completely fine in production mode, but lags horribly in development mode. I don't think this issue is easily fixable, but I wish there was a way to completely disable animated transitions in development mode.

So while the library is easy to use, the relative obscurity of its API meant that I spent much more time figuring out how to use it effectively than what was really needed.

### GraphQL and Graphcool

[GraphQL](http://graphql.org/) presents itself as an alternative to REST. A GraphQL API can be queried using a declarative JSON-like language, which mirrors the shape of the expected response.

For example, the following query...

```graphql
query PostQuery {
    allPosts {
        id
        title
        description
    }
}
```

... will result in the following response

```json
{
    "allPosts": [{
        "id": "0",
        "title": "GraphQL",
        "description": "Pretty cool"
    }]
}
```

The GraphQL standard also supports mutations, subscriptions, and much more. However, the implementation details of those features are left to the implementors. Which brings us to...

[Graphcool](https://www.graph.cool/)! Graphcool is a platform for creating GraphQL backends. It brings all the goodness of solutions like Firebase or Parse, with the added benefits of the GraphQL language. This notably allows for declaring your entire API specification in text format.

Here is the specification of the Popup Study API:

```graphql
type File implements Node {
  contentType: String!
  createdAt: DateTime!
  id: ID! @isUnique
  name: String!
  secret: String! @isUnique
  size: Int!
  updatedAt: DateTime!
  url: String! @isUnique
  user: User @relation(name: "Picture")
}

type Message implements Node {
  author: User @relation(name: "MessageOnUser")
  content: String
  createdAt: DateTime!
  id: ID! @isUnique
  sentAt: DateTime!
  thread: Thread @relation(name: "ThreadOnMessage")
  updatedAt: DateTime!
}

type Post implements Node {
  author: User @relation(name: "Authorship")
  createdAt: DateTime!
  description: String
  id: ID! @isUnique
  tags: [Tag!]! @relation(name: "Tagging")
  threads: [Thread!]! @relation(name: "ThreadOnPost")
  title: String
  updatedAt: DateTime!
}

type Tag implements Node {
  createdAt: DateTime!
  id: ID! @isUnique
  isCourse: Boolean
  name: String @isUnique
  posts: [Post!]! @relation(name: "Tagging")
  updatedAt: DateTime!
  users: [User!]! @relation(name: "Interests")
}

type Thread implements Node {
  author: User @relation(name: "ThreadOnUser")
  createdAt: DateTime!
  id: ID! @isUnique
  messages: [Message!]! @relation(name: "ThreadOnMessage")
  post: Post @relation(name: "ThreadOnPost")
  updatedAt: DateTime!
}

type User implements Node {
  createdAt: DateTime!
  email: String @isUnique
  firstName: String
  id: ID! @isUnique
  isSetup: Boolean
  messages: [Message!]! @relation(name: "MessageOnUser")
  password: String
  picture: File @relation(name: "Picture")
  posts: [Post!]! @relation(name: "Authorship")
  tags: [Tag!]! @relation(name: "Interests")
  threads: [Thread!]! @relation(name: "ThreadOnUser")
  updatedAt: DateTime!
}
```

Even complex permissions rules can be modeled with simple GraphQL queries. However, as a prototype, the current version of the Popup Study API has no permission rules.

### apollo-react

In order to interact with the GraphQL API provided by Graphcool, I chose to use the [Apollo](https://www.apollodata.com/) client and its React integration.

`apollo-react` allows for declaring data dependencies at the component level. For instance, a `<Post id="0" />` component could declare the query `PostQuery` from before, and `react-apollo` would take care of everything for us. Fetching the data when the component mounts, but also updating the data when it detects a mutation in some other part of the app.

Since Graphcool supports GraphQL subscriptions, `react-apollo` can also listen to the different subscription events. However, in this case, we need a bit more boilerplate as it is left to the user to decide how a given subscription event – for instance, a `create` event on a `Post` type – should update the underlying Apollo store.

Nevertheless, thanks to Graphcool and `apollo-react`, implementing and integrating a real-time messaging solution into Popup Study was a breeze! Well, maybe not exactly, but it was still much quicker than my previous attempts, and I expect the result to be much more robust.

### Redux

[Redux](http://redux.js.org/) is a application state management solution that was designed with the React model in mind. The main idea behind the library is to consider the current application state as a function of its initial state and a list of "actions" or events that have happened in the past. This model has many advantages, one of which is simplified debugging.

While the app itself doesn't use Redux much, both the navigation library and the GraphQL client use it to store their own data. Thankfully, it was very simple to setup both to use a shared store.

## Lessons learned

### 1. Navigation is hard

My last experiment with React Native already had little to no navigation. However, even in that case, figuring out how to model the flow between different views was a pain. I'm not satisfied with the current navigation, but for the small amount of different views in the app, I think it does an acceptable job.

### 2. GraphQL is amazing

This project was my first time using GraphQL/Graphcool, but certainly not my lastHaving tried implementing my own APIs in the past, as well as going through services like Parse, nothing comes close to the simplicity of GraphQL queries.

However, you can't model *everything* with GraphQL queries, and that's why Graphcool provides a way to create serverless functions to execute more complex operations. More on that later.

### 3. Documentation is important

As I previously mentioned, there was a clear divide in documentation quality between some components of the project. As mentioned before, the lack of good documentation for `ex-navigation` meant that I had to spent much more time trying to figure out its internal workings than I did for `apollo-react` or Graphcool. Thankfully, its successor `react-navigation` appears to have a much more exhaustive documentation.

### 4. Good UX takes time and effort

When I started the project, I had a lot of ideas regarding how to provide a good UX. Intelligent information display, animations and transitions, useful feedback and onboarding...

I ended up implementing none at all. Instead, I focused on getting the basic features to work to release a barebones proof of concept. Good UX takes time and effort, and requires a very good understanding of the whole application.

## Conclusion

While the prototype works and can already be used in its current state, it is more of a messaging app than anything else. The notion of matching students together, key to the initial concept, is represented very little in the current version. However, with more development and a clear vision, I believe it could eventually get to a satisfactory state.


