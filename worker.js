export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cookie = request.headers.get("Cookie") || "";

    // User already authenticated
    if (cookie.includes("family_access=granted")) {
      const response = await env.ASSETS.fetch(request);

      const headers = new Headers(response.headers);

      // Never cache private HTML pages
      if (headers.get("content-type")?.includes("text/html")) {
        headers.set("Cache-Control", "private, no-store");
      }

      return new Response(response.body, {
        status: response.status,
        headers
      });
    }

    // Login attempt
    if (request.method === "POST" && url.pathname === "/login") {
      const form = await request.formData();
      const password = form.get("password");

      if (password === env.FAMILY_PASSWORD) {
        return new Response(null, {
          status: 302,
          headers: {
            "Location": "/",
            "Set-Cookie":
              "family_access=granted; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000",
            "Cache-Control": "no-store"
          }
        });
      }

      return new Response("Wrong password", {
        status: 401,
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-store"
        }
      });
    }

    // Login page
    return new Response(`
<!doctype html>
<html>
<head>
<title>Family Archive</title>
</head>

<body>
<h1>Family Archive</h1>

<form method="POST" action="/login">
<input type="password" name="password">
<button type="submit">Enter</button>
</form>

</body>
</html>
`, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "no-store"
      }
    });
  }
};