import { useParams } from "react-router";
import Loader from "../../components/Loader";
import { useGetUserByIdQuery } from "../../redux/api/adminApiSlice";

const UserProfile = () => {
  const { id } = useParams();

  const { data: userData, isLoading } = useGetUserByIdQuery(id || "");

  // Access user object based on API response structure
  const user = userData?.user;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold capitalize">{user!.role}</h2>
      <section className="grid sm:grid-cols-2 grid-cols-1 place-items-center mt-8 gap-4">
        <div className="w-full sm:w-[80%] py-4 text-lg flex flex-col gap-4">
          <p>
            <span className="font-semibold">ID: </span>
            <span className="text-cyan-600">{user!.userId}</span>
          </p>
          <p>
            <span className="font-semibold">Name: </span>
            <span className="text-cyan-600">{user!.fullName}</span>
          </p>
          <p>
            <span className="font-semibold">Email: </span>
            <span className="text-cyan-600">{user!.email}</span>
          </p>
          <p>
            <span className="font-semibold">Role: </span>
            <span className="text-cyan-600 capitalize">{user!.role}</span>
          </p>
          {user!.createdAt && (
            <p>
              <span className="font-semibold">Joined: </span>
              <span className="text-cyan-600">
                {new Date(user!.createdAt).toLocaleDateString()}
              </span>
            </p>
          )}
        </div>
        <img
          className="object-cover rounded-xl w-full sm:w-[80%] max-h-[30rem]"
          src={
            user!.profilePicture === ""
              ? "https://res.cloudinary.com/dnn2nis25/image/upload/v1743597100/gym-system/ya0hva63onpxyzyexfpn.jpg"
              : user!.profilePicture
          }
          alt={`${user!.fullName}'s profile`}
        />
      </section>
    </div>
  );
};

export default UserProfile;
