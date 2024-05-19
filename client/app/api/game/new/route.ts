export async function POST(_request: Request) {
  const res = await fetch(`${process.env.BACKEND_URL}/game/new`, {
    method: "POST",
  });
  const data = await res.json();
  return Response.json(data);
}
