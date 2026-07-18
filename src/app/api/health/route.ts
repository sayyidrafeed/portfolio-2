export function GET() {
  return Response.json(
    {
      service: "portfolio",
      status: "ok",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
