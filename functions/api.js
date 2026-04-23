export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, "");
  const search = url.search;
  const airtableUrl = `https://api.airtable.com/v0${path}${search}`;

  const headers = {
    "Authorization": `Bearer ${env.AIRTABLE_TOKEN}`,
    "Content-Type": "application/json",
  };

  const init = { method: request.method, headers };
  if (["POST", "PATCH"].includes(request.method)) {
    init.body = await request.text();
  }

  const resp = await fetch(airtableUrl, init);
  const data = await resp.text();

  return new Response(data, {
    status: resp.status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
