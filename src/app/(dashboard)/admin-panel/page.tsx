import { auth } from "@/lib/auth";

const Page = async () => {
  const session = await auth();

  return (
    <div className="flex flex-col flex-wrap">
      <h1>Todo:</h1>
      {JSON.stringify(session)}
    </div>
  );
};

export default Page;
