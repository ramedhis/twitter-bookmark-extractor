import { OAuth } from 'oauth';

// Your Twitter API credentials
const CONSUMER_KEY = 'YOUR_CONSUMER_KEY';
const CONSUMER_SECRET = 'YOUR_CONSUMER_SECRET';
const CLIENT_ID = 'ZF9nTTFLczdLN2hzVXhlaXRINnQ6MTpjaQ';
const CLIENT_SECRET = 'FZ0OL9NlBgyOsbPoyKLwtNb4X6qZWMD2asMVMmLCYy9skK7ew3';

// Create an OAuth 1.0a client
const oauthClient = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  CONSUMER_KEY,
  CONSUMER_SECRET,
  '1.0A',
  null,
  'HMAC-SHA1'
);

// Step 1: Obtain a request token
oauthClient.getOAuthRequestToken((error, requestToken, requestTokenSecret) => {
  if (error) {
    console.error('Error getting request token:', error);
    return;
  }

  // Step 2: Construct the authorize URL
  const authorizeUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${requestToken}`;
  
  // Step 3: Redirect the user to the authorize URL (you would typically do this in a web application)
  console.log('Authorize URL:', authorizeUrl);
  console.log('Please visit the above URL to authorize your app.');

  // For a web application, you would typically redirect the user to the authorizeUrl.

  // Step 4: Handle the callback (After the user authorizes the app)
  // In a web application, you would receive the OAuth verifier from the callback URL.

  // For demonstration purposes, let's assume the OAuth verifier is obtained manually.
  const oauthVerifier = 'YOUR_OAUTH_VERIFIER';

  // Step 5: Obtain an access token
  oauthClient.getOAuthAccessToken(
    requestToken,
    requestTokenSecret,
    oauthVerifier,
    (error, accessToken, accessTokenSecret) => {
      if (error) {
        console.error('Error getting access token:', error);
        return;
      }

      // You now have the user's access token and access token secret for making API requests on their behalf
      console.log('Access Token:', accessToken);
      console.log('Access Token Secret:', accessTokenSecret);
    }
  );
});
