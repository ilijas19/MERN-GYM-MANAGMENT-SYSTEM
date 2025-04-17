import { useParams } from "react-router";
import { useGetSingleMemberQuery } from "../../redux/api/staffApiSlice";
import Loader from "../../components/Loader";
import { isMembershipValid } from "../../utils/isMembershipValid";

const MemberProfile = () => {
  const { id } = useParams();

  const { data: member, isLoading } = useGetSingleMemberQuery(id || "");
  console.log(member);

  if (isLoading) {
    return <Loader />;
  }

  const expDate = member!.member.membershipExpDate.toString();

  const isValid = isMembershipValid(expDate);
  console.log(isValid);

  return (
    <>
      <h2 className="text-2xl">{member?.member.role}</h2>
      <section className="grid sm:grid-cols-2 grid-cols-1 place-items-center mt-8">
        <div className="w-[80%] h-[80%] py-2 text-lg flex flex-col justify-evenly">
          <p>
            <span className="font-semibold">Id : </span>
            <span className={isValid ? "text-cyan-600" : "text-red-600"}>
              {member?.member.userId}
            </span>
          </p>
          <p>
            <span className="font-semibold">Name : </span>
            <span className="text-cyan-600">{member?.member.fullName}</span>
          </p>
          <p>
            <span className="font-semibold">Email : </span>
            <span className="text-cyan-600">{member?.member.email}</span>
          </p>
          <p>
            <span className="font-semibold">Package : </span>
            <span className="text-cyan-600">{member?.member.package.name}</span>
          </p>
          <p>
            <span className="font-semibold">Joined : </span>
            <span className="text-cyan-600">
              {member?.member.createdAt.toString().split("T")[0]}
            </span>
          </p>
          <p>
            <span className="font-semibold">Membership Expires : </span>
            <span className={isValid ? "text-cyan-600" : "text-red-600"}>
              {expDate.split("T")[0]}
            </span>
          </p>
        </div>
        <img
          className="object-cover rounded-xl w-[80%] h-[80%] max-h-[30rem]"
          src={
            member?.member.profilePicture === ""
              ? "https://res.cloudinary.com/dnn2nis25/image/upload/v1743597100/gym-system/ya0hva63onpxyzyexfpn.jpg"
              : member?.member.profilePicture
          }
          alt=""
        />
      </section>
    </>
  );
};

export default MemberProfile;
