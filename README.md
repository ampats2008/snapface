# Snapface

Snapface (not to be confused with [MyFace or InstantChat](https://twitter.com/edelman11/status/1438895683520634884)) is a social media web app that I developed to familiarize myself with the process of implementing common CRUD features (such as authentication via Google Accounts, comments/replies, user profile customization, etc.). In the next section, I'll list all the dependencies of the project and discuss the functionality that each one enables.

## Tools

- [Next.js](https://nextjs.org) - Front-end and API endpoints
- [Sanity.io](https://www.sanity.io/) - Headless CMS, and the Sanity JS Client
- [NextAuth.js](https://next-auth.js.org/) - User authentication
- [react-icons](https://react-icons.github.io/react-icons/) - icon pack
- [react-query](https://react-query.tanstack.com/) -
- [react-select](https://react-select.com/home)
- [react-tracked](https://react-tracked.js.org/)
- [uuid](https://www.npmjs.com/package/uuid)

### Next.js

Next.js was used for the front-end of the application. Additionally, its built-in API routing feature was used by Next-Auth.js, which we'll discuss in the next section. Next.js' SSR feature made a lot of sense to use for this project on multiple pages since their data could be updated by users at any time (E.g. the _Discover_ page loads the 100 most recent posts; the _Post Details_ page loads any comments made on a post).

### NextAuth.js

This package was used for providing authentication for user accounts on the website. I only chose to set up the Google Account provider, but you can also configure Next-Auth to use Facebook, Twitter, Github, Discord, and more for oAuth2.0 logins. JSON Web Tokens were used for storing user session info, rather than using database storage. Next-Auth provides an intuitive useSession hook that allows you to (1) detect if a valid session is active, and (2) restrict all or some of a page's content for authenticated users only.

### Sanity.io

This headless CMS drives the back-end of the application. It is a JSON document-based database, so it is closer to noSQL databases (like MongoDB) than relational databases. Schemas were created for Users, Accounts, Posts, Likes, Comments, Replies, PostedBys (an object that references a user who posted a like, comment, reply, or post), and Categories. Queries are performed using its proprietary language, GROQ. Thankfully, the documentation provided on Sanity's website is expansive and I was able to get up to speed pretty quickly (my only previous experience querying databases comes from mySQL/SQL).

### react-icons

Pretty self-explanitory, but react-icons gives you access to a number of different existing icons libraries in one package. Very helpful.

### react-query

React-Query was used for any client-side fetches performed. I originally picked it due to its popularity and I thought its additional features such as caching / background updates would be useful. However, I ran into a couple of issues regarding stale data that I haven't been able to resolve yet. More info about this issue is located in the _Unresolved Issues_ section of this post.

### react-select

This package was used for creating multi-select dropdown boxes on the _Create Post_ page. There are two input fields using this package on this page; they allow users to input multiple Tags / Categories in an intuitive manner.

### react-tracked

This is a lightweight global state-management solution that I found easy to learn due to my familiarity with React Hooks. It acts like useContext, but prevents the rerendering performance issues that useContext can cause. It allowed me to control the state of a root-level `<Snackbar />` component via dispatches from components buried deep in the React tree. I wanted "user-to-database" interactions to cause state changes in the `<Snackbar />`, so any user interactions with comments or likes will cause the `<Snackbar />` to pop up temporarily.

### uuid

This package was used for generating unique keys for Sanity documents and objects.

## Unresolved Issues

### Stale data

There is one annoying issue I keep running into when testing this project. After any mutation by the user, the data displayed on the page can occasionally be stale. I've noticed a couple ways to reproduce this issue.

1. On the _User Settings_ page, after the user customizes their profile and clicks the link to view their updated profile, the changes aren't visible for 20 to 30 seconds (and sometimes it requires a hard refresh (CTRL + F5) to update the UI).

2. On the _Post Details_ page, after the user posts a comment or likes/unlikes the post, a soft refresh of the page will cause the user's changes to disappear temporarily.

I believe this issue has to do with a conflict between React-Query and Sanity's client. I used React-Query for client-side fetches, but I used Sanity's client for mutations. If I used React-Query for mutations, this issue might not exist. This is something to look at for future patches.

### Image load times

Another issue I've run into is that some images don't load fast enough when the page loads. On the first load of the _Post details_ page, the post's image will be blank for up to five seconds before it displays. This has to do with Next.js SSR and its `<Image />` component, but I'm not sure how to fix it yet.
