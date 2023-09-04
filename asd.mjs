import Twit from 'twit';
import fs from 'fs';
import readline from 'readline';
import open from 'open';

const Twitter = new Twit({
  consumer_key: 'pePHA9JjB9RHNjTGcJe7bBIt2',
  consumer_secret: 'lUwmmLqxZFjpdgrKmtSXgSjlLhKW2civhQWA3TNpn5Yr0bw5s8',
  access_token: '1387075088411811843-eHb6lKjax75tzRkXdAxe98ozRnH5QG',  // Add the user's access token here
  access_token_secret: 'nAbcL7xKujjGV4N7fXQ8xDEnlBIUr1kN3D7NteYjQWE7P',  // Add the user's access token secret here
  timeout_ms: 60 * 1000,
});

// Create a readline interface to read user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to get an OAuth request token
async function getRequestToken() {
  return new Promise((resolve, reject) => {
    Twitter.get('oauth/request_token', { oauth_callback: 'oob' }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const requestToken = data;
        resolve(requestToken);
      }
    });
  });
}

// Function to open the authentication URL in a web browser
function openAuthURL(authURL) {
  console.log(`Please open the following URL in your web browser to authenticate: ${authURL}`);
  open(authURL);
}

// Function to get user's access token
async function getAccessToken(requestToken) {
  return new Promise((resolve, reject) => {
    rl.question('Enter the PIN code from the browser: ', (pin) => {
      Twitter.post(
        'oauth/access_token',
        { oauth_verifier: pin, ...requestToken },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            const accessToken = data;
            resolve(accessToken);
          }
        }
      );
    });
  });
}

// Function to get bookmarked tweet links
async function getBookmarkedTweets(accessToken) {
  try {
    const { data } = await Twitter.get('bookmarks/list', {
      access_token: accessToken.oauth_token,
    });
    const bookmarkedTweets = data.map((tweet) => {
      return tweet.tweet.id_str;
    });

    return bookmarkedTweets;
  } catch (error) {
    console.error('Error fetching bookmarked tweets:', error);
    throw error;
  }
}

// Function to save links to a text file
function saveLinksToFile(links) {
  const filename = 'bookmarked_tweets.txt';
  fs.writeFileSync(filename, links.join('\n'), 'utf-8');
  console.log(`Bookmarked tweet links saved to ${filename}`);
}

// Main function
async function main() {
  try {
    const requestToken = await getRequestToken();
    openAuthURL(`https://api.twitter.com/oauth/authenticate?oauth_token=${requestToken.oauth_token}`);
    const accessToken = await getAccessToken(requestToken);
    const bookmarkedTweets = await getBookmarkedTweets(accessToken);
    saveLinksToFile(bookmarkedTweets);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    rl.close();
  }
}

// Run the program
main();
