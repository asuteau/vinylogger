import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  requestToken: string;
  requestTokenSecret: string;
  accessToken: string;
  accessTokenSecret: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__remix_session",
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
      maxAge: 356 * 24 * 60 * 60 // 1 year
    },
  });

export { getSession, commitSession, destroySession };