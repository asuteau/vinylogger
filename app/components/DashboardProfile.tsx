import {GetIdentityResponse} from '@lionralfs/discogs-client/types/types';

type DashboardProfileProps = {
  user: GetIdentityResponse;
};

const DashboardProfile = ({user}: DashboardProfileProps) => {
  return <h2>Welcome back🤘</h2>;
};

export default DashboardProfile;
