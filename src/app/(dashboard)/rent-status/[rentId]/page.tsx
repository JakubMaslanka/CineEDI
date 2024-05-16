import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const RentStatusPage = async ({
  params: { rentId },
}: {
  params: { rentId: string };
}) => {
  const session = await auth();
  if (!session) redirect("/auth/sign-in");

  const rent = await db.query.rentals.findFirst({
    where: (schema, { and, eq }) =>
      and(eq(schema.id, +rentId), eq(schema.user_id, session.user.id)),
    with: {
      user_id: true,
      movie_id: true,
      edi_transaction_id: true,
    },
  });
  if (!rent) notFound();

  return (
    <div>
      <h1>TODO</h1>
      {JSON.stringify(rent)}
    </div>
  );
};

export default RentStatusPage;
