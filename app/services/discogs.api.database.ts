import * as crypto from 'crypto';
import createDebug from 'debug';
import {DiscogsUserAgent, User} from './discogs.strategy';
import {z} from 'zod';

let debug = createDebug('discogs:api');

const releaseURL = 'https://api.discogs.com/releases/{release_id}';
const searchURL = 'https://api.discogs.com/database/search';
const masterReleaseVersionsURL = 'https://api.discogs.com/masters/{master_id}/versions';

const releaseSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    year: z.number(),
    country: z.string(),
    images: z.array(
      z.object({
        uri: z.string(),
      }),
    ),
    formats: z.array(
      z.object({
        name: z.string(),
        qty: z.string(),
        text: z.optional(z.string()),
      }),
    ),
  })
  .transform((release) => ({
    id: release.id,
    title: release.title,
    year: release.year,
    country: release.country,
    images: release.images.map((image) => ({
      uri: image.uri,
    })),
    formats: release.formats.map((format) => ({
      name: format.name,
      quantity: format.qty,
      text: format.text,
    })),
  }));

export type Release = z.infer<typeof releaseSchema>;

const masterReleasesSchema = z.array(
  z
    .object({
      id: z.number(),
      thumb: z.string(),
      released: z.string(),
      country: z.string(),
      major_formats: z.array(z.string()),
      format: z.string(),
      stats: z.object({
        user: z.object({
          in_collection: z.number(),
          in_wantlist: z.number(),
        }),
      }),
    })
    .transform((release) => ({
      id: release.id,
      thumb: release.thumb,
      released: parseInt(release.released),
      country: release.country,
      majorFormat: release.major_formats[0] ?? '',
      format: release.format.replaceAll(', ', ' • '),
      isInCollection: release.stats.user.in_collection > 0,
      isInWantlist: release.stats.user.in_wantlist > 0,
    })),
);

export type MasterReleases = z.infer<typeof masterReleasesSchema>;

const searchResultsSchema = z.array(
  z
    .object({
      id: z.number(),
      title: z.string(),
      year: z.optional(z.string()),
      thumb: z.string(),
      user_data: z.object({
        in_collection: z.boolean(),
        in_wantlist: z.boolean(),
      }),
    })
    .transform((release) => ({
      id: release.id,
      title: release.title,
      year: release.year,
      thumb: release.thumb,
      isInCollection: release.user_data.in_collection,
      isInWantlist: release.user_data.in_wantlist,
    })),
);

export type SearchResults = z.infer<typeof searchResultsSchema>;

export const getReleaseById = async (user: User, releaseId: string): Promise<Release> => {
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
  const validatedData = releaseSchema.parse(responseBody);
  return validatedData;
};

export const search = async (user: User, query: string): Promise<SearchResults> => {
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
  const validatedData = searchResultsSchema.parse(responseBody.results);
  return validatedData;
};

export const getMasterReleaseVersions = async (user: User, masterId: string): Promise<MasterReleases> => {
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
  const validatedData = masterReleasesSchema.parse(responseBody.versions);
  return validatedData;
};
