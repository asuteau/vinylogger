import type {MetaFunction} from '@vercel/remix';
import {redirect} from '@vercel/remix';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Welcome to Vinylogger!'}];
};

export const loader = async () => {
  return redirect('/dashboard');
};
