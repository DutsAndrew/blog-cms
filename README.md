# blog-cms

Blog CMS is a Content-Management-System that allows users to interact with a back-end API to perform CRUD (create, read, update, and delete) operations. This service is only provided to authenticated users. Once authenticated a token is shared between the API and the front-end to perform safe database transactions.

Currently the Blog-CMS is built on NextJS 13, React, and TypeScript. It works in conjunction with the following two blog applications:
- [Blog API](https://github.com/DutsAndrew/blog-api) - a back-end API built on Node.js and Express
- [Blog Client](https://github.com/DutsAndrew/blog-client) - for users to interact and engage with various blog post

The Application can be accessed here: https://dutsandrew-blog-cms.vercel.app/