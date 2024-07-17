import * as crypto from 'crypto';
import createDebug from 'debug';
import {DiscogsUserAgent, User} from './discogs.strategy';
import {timeFromNow} from '~/utils/dates';
import {cleanId} from '~/utils/strings';
import {z} from 'zod';

let debug = createDebug('discogs:api');

const collectionURL = 'https://api.discogs.com/users/{username}/collection/folders/{folder_id}/releases';
const collectionReleaseDeleteURL =
  'https://api.discogs.com/users/{username}/collection/folders/{folder_id}/releases/{release_id}/instances/{instance_id}';
const collectionReleaseAddURL =
  'https://api.discogs.com/users/{username}/collection/folders/{folder_id}/releases/{release_id}';
const wantlistURL = 'https://api.discogs.com/users/{username}/wants';
const wantlistReleaseURL = 'https://api.discogs.com/users/{username}/wants/{release_id}';

const releaseSchema = z
  .object({
    instance_id: z.number(),
    resource_url: z.string(),
  })
  .transform((release) => ({
    instanceId: release.instance_id,
    resourceUrl: release.resource_url,
  }));

const releasesSchema = z.array(
  z
    .object({
      id: z.number(),
      instance_id: z.number(),
      date_added: z.string().datetime({offset: true}),
      basic_information: z.object({
        title: z.string(),
        cover_image: z.string(),
        artists: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
          }),
        ),
        formats: z.array(
          z.object({
            name: z.string(),
            text: z.optional(z.string()),
          }),
        ),
      }),
    })
    .transform((release) => ({
      id: release.id,
      instanceId: release.instance_id,
      artist: release.basic_information.artists.map((artist) => cleanId(artist.name))[0],
      title: release.basic_information.title,
      coverImage: release.basic_information.cover_image,
      format: release.basic_information.formats.map((format) => format.name)[0],
      addedOn: timeFromNow(release.date_added),
    })),
);

export type Release = z.infer<typeof releaseSchema>;
export type Releases = z.infer<typeof releasesSchema>;

const wantSchema = z
  .object({
    id: z.number(),
    resource_url: z.string(),
  })
  .transform((release) => ({
    id: release.id,
    resourceUrl: release.resource_url,
  }));

const wantsSchema = z.array(
  z
    .object({
      id: z.number(),
      date_added: z.string().datetime({offset: true}),
      basic_information: z.object({
        title: z.string(),
        cover_image: z.string(),
        artists: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
          }),
        ),
        formats: z.array(
          z.object({
            name: z.string(),
            text: z.optional(z.string()),
          }),
        ),
      }),
    })
    .transform((release) => ({
      id: release.id,
      artist: release.basic_information.artists.map((artist) => cleanId(artist.name))[0],
      title: release.basic_information.title,
      coverImage: release.basic_information.cover_image,
      format: release.basic_information.formats.map((format) => format.name)[0],
      addedOn: timeFromNow(release.date_added),
    })),
);

export type Want = z.infer<typeof wantSchema>;
export type Wants = z.infer<typeof wantsSchema>;

export const getReleasesFromCollection = async (user: User): Promise<Releases> => {
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
  const validatedData = releasesSchema.parse(responseBody.releases);
  return validatedData;
};

export const removeReleaseFromCollection = async (user: User, releaseId: string, instanceId: string): Promise<null> => {
  // generate 32 bytes which is a string of 64 characters in hex encoding
  // because any request that includes a nonce string of length > 64 characters is rejected
  const nonce = crypto.randomBytes(32).toString('hex', 0, 64);
  // timestamp is expected in seconds
  const timestamp = Math.floor(Date.now() / 1000);

  const url = new URL(
    collectionReleaseDeleteURL
      .replace('{username}', user.username)
      .replace('{folder_id}', '1')
      .replace('{release_id}', releaseId)
      .replace('{instance_id}', instanceId),
  );
  const urlString = url.toString();

  debug('Remove release from collection', urlString);
  const response = await fetch(urlString, {
    method: 'DELETE',
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

  return null;
};

export const addReleaseToCollection = async (user: User, releaseId: string): Promise<Release> => {
  // generate 32 bytes which is a string of 64 characters in hex encoding
  // because any request that includes a nonce string of length > 64 characters is rejected
  const nonce = crypto.randomBytes(32).toString('hex', 0, 64);
  // timestamp is expected in seconds
  const timestamp = Math.floor(Date.now() / 1000);

  const url = new URL(
    collectionReleaseAddURL
      .replace('{username}', user.username)
      .replace('{folder_id}', '1')
      .replace('{release_id}', releaseId),
  );
  const urlString = url.toString();

  debug('Add release to collection', urlString);
  const response = await fetch(urlString, {
    method: 'POST',
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

export const getReleasesFromWantlist = async (user: User): Promise<Wants> => {
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
  const validatedData = wantsSchema.parse(responseBody.wants);
  return validatedData;
};

export const removeReleaseFromWantlist = async (user: User, releaseId: string): Promise<null> => {
  // generate 32 bytes which is a string of 64 characters in hex encoding
  // because any request that includes a nonce string of length > 64 characters is rejected
  const nonce = crypto.randomBytes(32).toString('hex', 0, 64);
  // timestamp is expected in seconds
  const timestamp = Math.floor(Date.now() / 1000);

  const url = new URL(wantlistReleaseURL.replace('{username}', user.username).replace('{release_id}', releaseId));
  const urlString = url.toString();

  debug('Remove release from wantlist', urlString);
  const response = await fetch(urlString, {
    method: 'DELETE',
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

  return null;
};

export const addReleaseToWantlist = async (user: User, releaseId: string): Promise<Want> => {
  // generate 32 bytes which is a string of 64 characters in hex encoding
  // because any request that includes a nonce string of length > 64 characters is rejected
  const nonce = crypto.randomBytes(32).toString('hex', 0, 64);
  // timestamp is expected in seconds
  const timestamp = Math.floor(Date.now() / 1000);

  const url = new URL(wantlistReleaseURL.replace('{username}', user.username).replace('{release_id}', releaseId));
  const urlString = url.toString();

  debug('Add release to wantlist', urlString);
  const response = await fetch(urlString, {
    method: 'PUT',
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
  const validatedData = wantSchema.parse(responseBody);
  return validatedData;
};
