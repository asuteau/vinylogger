import {useUserContext} from '~/contexts/user-context';

// Provides data to the component
export const loader = async () => {
  return null;
};

// Renders the UI
const WantlistRoute = () => {
  return <h1>Wantlist page</h1>;
};

// Updates persistent data
export const action = async () => {};

export default WantlistRoute;
