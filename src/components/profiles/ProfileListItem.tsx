import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FC } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ProfilesApi from "../../api/profiles";
import { ListProfile } from "../../api/types";
import { useAuth } from "../../hooks/useAuth";
import defaultAvatar from "../../assets/avatar.jpg";

interface ProfileListItemProps {
  profile: ListProfile;
}

const ProfileListItem: FC<ProfileListItemProps> = ({ profile }) => {
  const { user } = useAuth();
  const client = useQueryClient();

  const followMutation = useMutation({
    mutationFn: () => ProfilesApi.follow(profile.username),
    onSuccess: async () => {
      await client.refetchQueries(['profiles']);
      toast.success(`You are now following user: ${profile.username}`);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error('Could not follow user...');
        return;
      }

      toast.error('Something went wrong...');
    }
  });

  const unfollowMutation = useMutation({
    mutationFn: () => ProfilesApi.unfollow(profile.username),
    onSuccess: async () => {
      await client.refetchQueries(['profiles']);
      toast.success(`You are no longer following user: ${profile.username}`);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error('Could not unfollow user...');
        return;
      }

      toast.error('Something went wrong...');
    }
  });

  const handleFollow = () => followMutation.mutate();

  const handleUnfollow = () => unfollowMutation.mutate();

  return (
    <div className="card d-flex flex-column align-items-center gap-2 p-2">
      <img
        className="rounded-circle"
        width="50" height="50"
        src={profile.image || defaultAvatar}
        alt=""
      />
      <Link to={`/profiles/${profile.username}`}>{profile.username}</Link>
      <div>
        {profile.username !== user?.username ? (
          profile.is_followed_by_you ? (
            <button
              className="btn btn-sm btn-outline-danger"
              disabled={unfollowMutation.isLoading}
              onClick={handleUnfollow}
            >
              Unfollow {profile.username}
            </button>
          ) : (
            <button
              className="btn btn-sm btn-outline-primary"
              disabled={followMutation.isLoading}
              onClick={handleFollow}
            >
              Follow {profile.username}
            </button>
          )
        ) : (
          <Link to={`/profiles/${profile.username}`} className="btn btn-sm btn-outline-secondary">
            Edit Profile
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProfileListItem;
