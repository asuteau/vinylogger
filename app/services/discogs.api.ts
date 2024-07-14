import * as crypto from 'crypto';
import createDebug from 'debug';
import {DiscogsUserAgent, User} from './discogs.strategy';
import {timeFromNow} from '~/utils/dates';
import {cleanId} from '~/utils/strings';

let debug = createDebug('discogs:api');

const collectionURL = 'https://api.discogs.com/users/{username}/collection/folders/{folder_id}/releases';
const wantlistURL = 'https://api.discogs.com/users/{username}/wants';
const releaseURL = 'https://api.discogs.com/releases/{release_id}';
const searchURL = 'https://api.discogs.com/database/search';
const masterReleaseVersionsURL = 'https://api.discogs.com/masters/{master_id}/versions';

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

export const getReleaseById = async (
  user: User,
  releaseId: string,
): Promise<{
  id: number;
  title: string;
  images: {uri: string}[];
}> => {
  // generate 32 bytes which is a string of 64 characters in hex encoding
  // because any request that includes a nonce string of length > 64 characters is rejected
  const nonce = crypto.randomBytes(32).toString('hex', 0, 64);
  // timestamp is expected in seconds
  const timestamp = Math.floor(Date.now() / 1000);

  const url = new URL(releaseURL.replace('{release_id}', releaseId));
  const urlString = url.toString();

  debug('Get releases from database', urlString);
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
  return {
    id: responseBody.id,
    title: responseBody.title,
    images: responseBody.images.map((image: any) => ({
      uri: image.uri,
    })),
  };
};

export const search = async (
  user: User,
  query: string,
): Promise<
  {
    title: string;
    year: string;
    id: number;
    thumb: string;
    isInCollection: boolean;
    isInWantlist: boolean;
  }[]
> => {
  // generate 32 bytes which is a string of 64 characters in hex encoding
  // because any request that includes a nonce string of length > 64 characters is rejected
  const nonce = crypto.randomBytes(32).toString('hex', 0, 64);
  // timestamp is expected in seconds
  const timestamp = Math.floor(Date.now() / 1000);

  const url = new URL(searchURL);
  let params = new URLSearchParams();
  params.set('q', query);
  params.set('type', 'master');
  params.set('per_page', '20');
  url.search = params.toString();
  const urlString = url.toString();

  debug('Search from database', urlString);
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
  return responseBody.results.map((result: any) => ({
    title: result.title,
    year: result.year,
    id: result.id,
    thumb: result.thumb,
    isInCollection: result.user_data.in_collection,
    isInWantlist: result.user_data.in_wantlist,
  }));
};

export const getMasterReleaseVersions = async (
  user: User,
  masterId: string,
): Promise<
  {
    id: number;
    thumb: string;
    released: string;
    country: string;
    majorFormat: string;
    format: string;
    isInCollection: boolean;
    isInWantlist: boolean;
  }[]
> => {
  // generate 32 bytes which is a string of 64 characters in hex encoding
  // because any request that includes a nonce string of length > 64 characters is rejected
  const nonce = crypto.randomBytes(32).toString('hex', 0, 64);
  // timestamp is expected in seconds
  const timestamp = Math.floor(Date.now() / 1000);

  const url = new URL(masterReleaseVersionsURL.replace('{master_id}', masterId));
  let params = new URLSearchParams();
  params.set('per_page', '20');
  params.set('sort', 'released');
  params.set('sort_order', 'desc');
  params.set('format', 'Vinyl');
  url.search = params.toString();
  const urlString = url.toString();

  debug('Get master release versions from database', urlString);
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
  return responseBody.versions.map((version: any) => ({
    id: version.id,
    thumb: version.thumb,
    released: version.released,
    country: version.country,
    majorFormat: version.major_formats[0] ?? '',
    format: version.format.replaceAll(', ', ' • '),
    isInCollection: version.stats.user.in_collection > 0,
    isInWantlist: version.stats.user.in_wantlist > 0,
  }));
};
