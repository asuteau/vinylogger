import {Form, NavLink} from '@remix-run/react';

const DashboardLogout = () => {
  return (
    <ul className="mt-auto">
      <li>
        <Form method="post">
          <NavLink to="/logout" className="underline">
            Log out
          </NavLink>
        </Form>
      </li>
    </ul>
  );
};

export default DashboardLogout;
