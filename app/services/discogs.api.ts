import * as crypto from 'crypto';
import createDebug from 'debug';
import {DiscogsUserAgent, User} from './discogs.strategy';
import {timeFromNow} from '~/utils/dates';
import {cleanId} from '~/utils/strings';

let debug = createDebug('discogs:api');

const collectionURL = 'https://api.discogs.com/users/{username}/collection/folders/{folder_id}/releases';
const wantlistURL = 'https://api.discogs.com/users/{username}/wants';

export const getReleasesFromCollection = async (
  user: User,
): Promise<
  {
    id: number;
    instanceId: number;
    artist: string;
    title: string;
    coverImage: string;
    format: string;
    addedOn: string;
  }[]
> => {
  // generate 32 bytes which is a string of 64 characters in hex encoding
  // because any request that includes a nonce string of length > 64 characters is rejected
  const nonce = crypto.randomBytes(32).toString('hex', 0, 64);
  // timestamp is expected in seconds
  const timestamp = Math.floor(Date.now() / 1000);

  const url = new URL(collectionURL.replace('{username}', user.username).replace('{folder_id}', '0'));
  let params = new URLSearchParams();
  params.set('sort', 'added');
  params.set('sort_order', 'desc');
  params.set('per_page', '10');
  url.search = params.toString();
  const urlString = url.toString();

  debug('Get releases from collection', urlString);
  const response = await fetch(urlString, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `OAuth oauth_consumer_key="${user.consumerKey}", oauth_nonce="${nonce}", oauth_token="${user.accessToken}", oauth_signature="${user.consumerSecret}&${user.accessTokenSecret}", oauth_signature_method="PLAINTEXT", oauth_timestamp="${timestamp}", oauth_version="1.0"`,
      'User-Agent': DiscogsUserAgent,
    },
  });

  if (!response.ok) {
    const responseText = await response.text();
    debug('error!', responseText, response);
    throw new Response(responseText, {status: 401});
  }

  const responseBody = await response.json();
  return responseBody.releases.map((release: any) => ({
    id: release.id,
    instanceId: release.instance_id,
    artist: release.basic_information.artists.map((artist: any) => cleanId(artist.name))[0],
    title: release.basic_information.title,
    coverImage: release.basic_information.cover_image,
    format: release.basic_information.formats.map((format: any) => format.name)[0],
    addedOn: timeFromNow(release.date_added),
  }));
};

export const getReleasesFromWantlist = async (
  user: User,
): Promise<
  {
    id: number;
    artist: string;
    title: string;
    coverImage: string;
    format: string;
    addedOn: string;
  }[]
> => {
  // generate 32 bytes which is a string of 64 characters in hex encoding
  // because any request that includes a nonce string of length > 64 characters is rejected
  const nonce = crypto.randomBytes(32).toString('hex', 0, 64);
  // timestamp is expected in seconds
  const timestamp = Math.floor(Date.now() / 1000);

  const url = new URL(wantlistURL.replace('{username}', user.username));
  let params = new URLSearchParams();
  params.set('sort', 'added');
  params.set('sort_order', 'desc');
  params.set('per_page', '10');
  url.search = params.toString();
  const urlString = url.toString();

  debug('Get releases from wantlist', urlString);
  const response = await fetch(urlString, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `OAuth oauth_consumer_key="${user.consumerKey}", oauth_nonce="${nonce}", oauth_token="${user.accessToken}", oauth_signature="${user.consumerSecret}&${user.accessTokenSecret}", oauth_signature_method="PLAINTEXT", oauth_timestamp="${timestamp}", oauth_version="1.0"`,
      'User-Agent': DiscogsUserAgent,
    },
  });

  if (!response.ok) {
    const responseText = await response.text();
    debug('error! ' + responseText);
    throw new Response(responseText, {status: 401});
  }

  const responseBody = await response.json();
  return responseBody.wants.map((release: any) => ({
    id: release.id,
    artist: release.basic_information.artists.map((artist: any) => cleanId(artist.name))[0],
    title: release.basic_information.title,
    coverImage: release.basic_information.cover_image,
    format: release.basic_information.formats.map((format: any) => format.name)[0],
    addedOn: timeFromNow(release.date_added),
  }));
};
