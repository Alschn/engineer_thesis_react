import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FC, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PostsApi from "../../api/posts";
import ProfilesApi from "../../api/profiles";
import defaultAvatar from "../../assets/avatar.jpg";
import { useAuth } from "../../hooks/useAuth";

const ProfilesDetail: FC = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isCurrentUser = user?.username === username;

  const client = useQueryClient();

  const query = useQuery({
    queryKey: ["profiles", username],
    queryFn: ({ queryKey }) => ProfilesApi.getProfile(queryKey[1] as string),
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 404) {
        toast.error('The profile you are looking for does not exist...');
        navigate("/profiles");
      }
    },
    retry: (failureCount, error) => {
      // @ts-ignore
      return error?.response?.status !== 404;
    }
  });

  const followMutation = useMutation({
    mutationFn: () => ProfilesApi.follow(username!),
    onSuccess: ({ data }) => {
      client.setQueryData(["profiles", username], (old: any) => ({
        ...old,
        data: {
          ...old.data,
          is_followed_by_you: data.is_followed_by_you,
          followers_count: data.followers_count
        }
      }));
      toast.success(`You are now following user: ${username}`);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error('Something went wrong...');
        return;
      }

      toast.error('Something went wrong...');
    }
  });

  const unfollowMutation = useMutation({
    mutationFn: () => ProfilesApi.unfollow(username!),
    onSuccess: ({ data }) => {
      client.setQueryData(["profiles", username], (old: any) => ({
        ...old,
        data: {
          ...old.data,
          is_followed_by_you: data.is_followed_by_you,
          followers_count: data.followers_count
        }
      }));
      toast.success(`You are no longer following user: ${username}`);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error('Something went wrong...');
        return;
      }

      toast.error('Something went wrong...');
    }
  });

  const profile = useMemo(() => {
    return query.data?.data || null;
  }, [query]);

  const followersQuery = useInfiniteQuery({
    queryKey: ["profiles-followers", username],
    queryFn: ({ queryKey }) => ProfilesApi.getFollowers(queryKey[1] as string),
    enabled: !!profile
  });

  const followers = useMemo(() => {
    return followersQuery.data?.pages?.flatMap(p => p.data.results) || [];
  }, [followersQuery]);

  const followedQuery = useInfiniteQuery({
    queryKey: ["profiles-followed", username],
    queryFn: ({ queryKey }) => ProfilesApi.getFollowed(queryKey[1] as string),
    enabled: !!profile
  });

  const followed = useMemo(() => {
    return followedQuery.data?.pages?.flatMap(p => p.data.results) || [];
  }, [followedQuery]);

  const postsQuery = useInfiniteQuery({
    queryKey: ["posts-authors", username],
    queryFn: ({ queryKey }) => PostsApi.getAll({ author__user__username: queryKey[1] as string }),
    enabled: !!profile
  });

  const createdPosts = useMemo(() => {
    return postsQuery.data?.pages?.flatMap(p => p.data.results) || [];
  }, [postsQuery]);

  const favouritesQuery = useInfiniteQuery({
    queryKey: ["posts-favourites", username],
    queryFn: () => PostsApi.getFavourites(),
    enabled: !!profile && isCurrentUser
  });

  const favourites = useMemo(() => {
    return favouritesQuery.data?.pages?.flatMap(p => p.data.results) || [];
  }, [favouritesQuery]);

  if (query.isLoading) {
    return <p>Loading...</p>;
  }

  if (query.isError) {
    return <p>Something went wrong...</p>;
  }

  if (query.isSuccess && profile) {
    return (
      <div className="row g-1">
        <div className="col-12">
          <div className="card p-4 align-items-center">
            <figure>
              <img
                width="100" height="100"
                src={profile.image || defaultAvatar}
                alt="Profile avatar"
              />
            </figure>
            <h1>{profile.username}</h1>
            <h3>{profile.email}</h3>
            <p className="text-muted">{profile.bio || ""}</p>
            {isCurrentUser ? (
              <Link to="#" className="btn btn-primary">Edit profile</Link>
            ) : (
              (profile.is_followed_by_you ? (
                <button
                  className="btn btn-danger"
                  onClick={() => unfollowMutation.mutate()}
                  disabled={unfollowMutation.isLoading}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => followMutation.mutate()}
                  disabled={followMutation.isLoading}
                >
                  Follow
                </button>
              ))
            )}
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card p-4">
            <h3>Followers ({profile.followers_count}):</h3>
            <div className="d-flex flex-column gap-2" style={{ height: "300px", "overflowY": "auto" }}>
              {followers.map((follower) => (
                <div className="d-flex align-items-center" key={`followers-${follower.id}`}>
                  <img
                    width="50" height="50"
                    src={follower.image || defaultAvatar}
                    alt="Profile avatar"
                  />
                  <a href={`/profiles/${follower.username}`} className="ms-2">
                    {follower.username}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card p-4">
            <h3>Following ({profile.followed_count}):</h3>
            <div className="d-flex flex-column gap-2" style={{ height: "300px", "overflowY": "auto" }}>
              {followed.map((followee) => (
                <div className="d-flex align-items-center" key={`followers-${followee.id}`}>
                  <img
                    width="50" height="50"
                    src={followee.image || defaultAvatar}
                    alt="Profile avatar"
                  />
                  <a href={`/profiles/${followee.username}`} className="ms-2">
                    {followee.username}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card p-4">
            <h3>Favourite Posts ({profile.favourites_count}):</h3>

            TODO:
          </div>
        </div>

        <div className="col-12">
          <div className="card p-4">
            <h3>Created Posts ({profile.posts_count}):</h3>

            TODO:
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ProfilesDetail;
