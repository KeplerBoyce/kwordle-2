export async function POST(request: Request, { params }: {
  params: {
    id: string,
  },
}) {
  const { id } = params;

  const req_data = await request.json();

  const headers: HeadersInit = new Headers();
  headers.set("Content-Type", "application/json");

  const res = await fetch(`${process.env.BACKEND_URL}/game/${id}/user`, {
    method: "POST",
    headers,
    body: JSON.stringify(req_data),
  });
  const data = await res.json();
  return Response.json(data);
}
