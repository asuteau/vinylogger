import {GetProfileResponse} from '@lionralfs/discogs-client';

type UserProfileProps = {
  className: string;
  profile: GetProfileResponse;
};

const UserProfile = ({className, profile}: UserProfileProps) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <img src={profile.avatar_url} className="w-10 h-10 rounded-full" />
      <h3>{profile.username}</h3>
    </div>
  );
};

export default UserProfile;
