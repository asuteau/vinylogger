import {DiscogsClient, GetReleaseResponse, PaginationParameters, SortParameters} from '@lionralfs/discogs-client';
import Release from '~/entities/release';
import {timeFromNow} from '~/utils/dates';
import {cleanId} from '~/utils/strings';

const DISCOGS_API_ENDPOINT = 'https://api.discogs.com';
const DISCOGS_USER_AGENT = 'Vinylogger/1.0';

export const getRequestToken = async (
  consumerKey: string,
  consumerSecret: string,
  callbackUrl: string,
): Promise<{requestToken: string; requestTokenSecret: string}> => {
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = timestamp.toString();

  const authString = `OAuth oauth_consumer_key="${consumerKey}", oauth_nonce="${nonce}", oauth_signature="${consumerSecret}&", oauth_signature_method="PLAINTEXT", oauth_timestamp="${timestamp}", oauth_callback="${callbackUrl}"`;

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: authString,
    'User-Agent': DISCOGS_USER_AGENT,
  };

  const url = `${DISCOGS_API_ENDPOINT}/oauth/request_token`;

  console.log('headers', headers);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.text();

    const tokenPairs = data.split('&');
    console.log('tokenPairs', tokenPairs);
    const requestToken = tokenPairs[0].split('=')[1];
    const requestTokenSecret = tokenPairs[1].split('=')[1];

    return {requestToken, requestTokenSecret};
  } catch (error) {
    console.error('Error getting Discogs request token:', error.message);
    throw error;
  }
};

export const buildAuthorizationUrl = (requestToken: string): string => {
  return `https://www.discogs.com/oauth/authorize?oauth_token=${requestToken}`;
};

export const getAccessToken = async (
  consumerKey: string,
  consumerSecret: string,
  requestToken: string,
  requestTokenSecret: string,
  userVerifier: string,
): Promise<{accessToken: string; accessTokenSecret: string}> => {
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = timestamp.toString();

  const authString = `OAuth oauth_consumer_key="${consumerKey}", oauth_nonce="${nonce}", oauth_token="${requestToken}", oauth_signature="${consumerSecret}&${requestTokenSecret}", oauth_signature_method="PLAINTEXT", oauth_timestamp="${timestamp}", oauth_verifier="${userVerifier}"`;

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: authString,
    'User-Agent': DISCOGS_USER_AGENT,
  };

  const url = `${DISCOGS_API_ENDPOINT}/oauth/access_token`;

  const body = new URLSearchParams();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    const data = await response.text();
    // console.log('response', response)

    const tokenPairs = data.split('&');
    const accessToken = tokenPairs[0].split('=')[1];
    const accessTokenSecret = tokenPairs[1].split('=')[1];

    return {accessToken, accessTokenSecret};
  } catch (error) {
    console.error('Error getting Discogs access token:', error.message);
    throw error;
  }
};

export const getUserIdentity = async (
  consumerKey: string,
  consumerSecret: string,
  accessToken: string,
  accessTokenSecret: string,
): Promise<{id: string; userName: string; resourceUrl: string; consumerName: string}> => {
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = timestamp.toString();

  const authString = `OAuth oauth_consumer_key="${consumerKey}", oauth_nonce="${nonce}", oauth_token="${accessToken}", oauth_signature="${consumerSecret}&${accessTokenSecret}", oauth_signature_method="PLAINTEXT", oauth_timestamp="${timestamp}"`;

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: authString,
    'User-Agent': DISCOGS_USER_AGENT,
  };

  const url = `${DISCOGS_API_ENDPOINT}/oauth/identity`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();
    // console.log('response', response)

    return {id: data.id, userName: data.username, resourceUrl: data.resource_url, consumerName: data.consumer_name};
  } catch (error) {
    console.error('Error getting Discogs user identity:', error.message);
    throw error;
  }
};

export const getUserProfile = async (
  consumerKey: string,
  consumerSecret: string,
  accessToken: string,
  accessTokenSecret: string,
  userName: string,
): Promise<{collectionItemsCount: number}> => {
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = timestamp.toString();

  const authString = `OAuth oauth_consumer_key="${consumerKey}", oauth_nonce="${nonce}", oauth_token="${accessToken}", oauth_signature="${consumerSecret}&${accessTokenSecret}", oauth_signature_method="PLAINTEXT", oauth_timestamp="${timestamp}"`;

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: authString,
    'User-Agent': DISCOGS_USER_AGENT,
  };

  const url = `${DISCOGS_API_ENDPOINT}/users/${userName}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();
    // console.log('response', response)

    return {collectionItemsCount: data.num_collection};
  } catch (error) {
    console.error('Error getting Discogs user profile:', error.message);
    throw error;
  }
};

export const getAllFromCollection = async (
  client: DiscogsClient,
  user: string,
  params: PaginationParameters &
    SortParameters<'label' | 'artist' | 'title' | 'catno' | 'format' | 'rating' | 'added' | 'year'>,
): Promise<Release[]> => {
  const releases = await client.user().collection().getReleases(user, 0, params);
  const response = releases.data.releases;

  return response.map((release) => ({
    id: release.id,
    artist: release.basic_information.artists.map((artist) => cleanId(artist.name)).join(', '),
    title: release.basic_information.title,
    coverImage: release.basic_information.cover_image,
    format: release.basic_information.formats.map((format) => format.name).join(', '),
    addedOn: timeFromNow(release.date_added),
  }));
};

export const getAllFromWantlist = async (
  client: DiscogsClient,
  user: string,
  params: PaginationParameters,
): Promise<Release[]> => {
  const releases = await client.user().wantlist().getReleases(user, params);
  const response = releases.data.wants;

  return response.map((release) => ({
    id: release.id,
    artist: release.basic_information.artists.map((artist) => cleanId(artist.name)).join(', '),
    title: release.basic_information.title,
    coverImage: release.basic_information.cover_image,
    format: release.basic_information.formats.map((format) => format.name).join(', '),
    addedOn: timeFromNow(release.date_added),
  }));
};

export const getReleaseById = async (client: DiscogsClient, releaseId: string): Promise<GetReleaseResponse> => {
  const release = await client.database().getRelease(releaseId);
  return release.data;
};
