# Shurlten

A self-hosted URL shortener web app.

Why? I don't trust the lifetimes of URLs that I might store with URL shortening services. Years from now I might (probably) find that those shortened URLs no longer exist. 

### Overview

- A URL is shortened from https://www.adomain.com/long+long+long+long+abcdefg+1234567 to http://localhost:3000/123
- A Sqlite database maintains mappings from shortened URLs to full URLs.
- A nodejs web server manages the communication between the vanilla JS frontend and the databse. When the web server is requested to serve a page with a shortened URL, it consults the mapping database and redirects to the full URL.
- In case you forget or lose your shortened URLs, a list of the mappings is displaced at the root page.

### Namespacing

There are 62 valid characters for the shortened URL extensions:

- 26 miniscule letters
- 26 capital letters
- 10 digits

Counting all the permutations:
$$
62^3 = 238,328
$$
This should be more than enough unique URL extensions for personal use, while maintaining a small extension length for easier memorization.

### Usage

- Install the node modules listed in package.json:

`npm install`

- Start the service:

`node index.js` 

*or* to keep it running

`nohup node index.js &`

- Use the web interface at `/` to shorten URLs. 

- Direct your browser to the shortened URL. 

### Contribution Ideas

- Ensure compatibility and create documentation for Windows and MacOS as the primary focus is currently Linux.
- The ability to delete unwanted URLs.
- Aesthetics.
- Dockerfile.
- More contribution ideas.
