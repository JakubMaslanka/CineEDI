import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    status: 200,
    state: "Healthy",
    name: require("../../../../package.json").name,
    version: require("../../../../package.json").version,
    nextVersion: require("../../../../package.json").dependencies.next,
    nodeEnv: process.env.NODE_ENV,
    lastCommit:
      require("child_process")
        .execSync("git rev-parse HEAD")
        .toString()
        .trim() ?? null,
  });
}
