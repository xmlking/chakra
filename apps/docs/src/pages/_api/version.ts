// http://localhost:3000/version
export async function GET() {
  return Response.json({
    version: "1.0.0",
  });
}
