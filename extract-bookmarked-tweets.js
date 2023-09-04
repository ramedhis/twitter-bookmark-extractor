#!/usr/bin/env node

const Twit = require('twit');
const crypto = require('crypto');
const axios = require('axios');
const OAuth = require('oauth-1.0a');
const fs = require('fs');

const twitterApiEndpoint = 'https://api.twitter.com/1.1/statuses/user_timeline.json'; // Replace with the correct API endpoint
const twitterUsername = 'twitter_username'; // Replace with the Twitter username

const axiosConfig = {
  headers: {
    Authorization: 'AAAAAAAAAAAAAAAAAAAAAL4OpwEAAAAABAZVamvrarC%2BSBI62KMuS9wv78s%3DgB6Yq5Vof69XaeUJKBVcDtrAS1letcBV793ePuSf6brWlP3JVt', // Replace with your OAuth2 token or other authentication method ('Bearer your_oauth2_token')
  },
};

axios.get(twitterApiEndpoint, {
  params: {
    screen_name: twitterUsername,
  },
  ...axiosConfig,
})
  .then(response => {
    // Handle the response data here
    console.log(response.data);
  })
  .catch(error => {
    // Handle errors here
    console.error('Error:', error.message);
  });

const config = {
  consumer_key: 'pePHA9JjB9RHNjTGcJe7bBIt2',
  consumer_secret: 'lUwmmLqxZFjpdgrKmtSXgSjlLhKW2civhQWA3TNpn5Yr0bw5s8',
  token: '1387075088411811843-eHb6lKjax75tzRkXdAxe98ozRnH5QG',
  token_secret: 'nAbcL7xKujjGV4N7fXQ8xDEnlBIUr1kN3D7NteYjQWE7P',
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