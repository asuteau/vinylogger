import {Form, NavLink} from '@remix-run/react';

type UserSignOutProps = {
  className?: string;
};

const UserSignOut = ({className = ''}: UserSignOutProps) => {
  return (
    <Form method="post" className={className}>
      <NavLink to="/logout">Log out</NavLink>
    </Form>
  );
};

export default UserSignOut;
