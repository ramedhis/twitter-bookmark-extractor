const axios = require('axios');
const OAuth = require('oauth-1.0a');

const config = {
  consumer_key: 'YOUR_CONSUMER_KEY',
  consumer_secret: 'YOUR_CONSUMER_SECRET',
  token: 'YOUR_ACCESS_TOKEN',
  token_secret: 'YOUR_ACCESS_TOKEN_SECRET',
};

const oauth = OAuth({
  consumer: {
    key: config.consumer_key,
    secret: config.consumer_secret,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  },
});

const request_data = {
  url: 'https://api.twitter.com/2/tweets/bookmarked',
  method: 'GET',
};

const token = {
  key: config.token,
  secret: config.token_secret,
};

const requestData = {
  url: request_data.url,
  method: request_data.method,
};

axios
  .get(oauth.authorize(requestData, token))
  .then((response) => {
    const bookmarkedTweets = response.data.data;
    const bookmarkedLinks = bookmarkedTweets.map((tweet) => tweet.url);
    const text = bookmarkedLinks.join('\n'); // Combine links with newline characters

    // Write the links to a text file
    fs.writeFile('bookmarked-links.txt', text, (err) => {
      if (err) {
        console.error('Error writing to the file:', err);
      } else {
        console.log('Bookmarked links saved to bookmarked-links.txt');
      }
    });
  })
  .catch((error) => {
    console.error('Error fetching bookmarked tweets:', error);
  });