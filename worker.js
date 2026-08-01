export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const cookie = request.headers.get("Cookie") || "";

    // Already logged in
    if (cookie.includes("family_access=granted")) {
      return env.ASSETS.fetch(request);
    }

    // Handle password submission
    if (request.method === "POST" && url.pathname === "/login") {
      const form = await request.formData();
      const password = form.get("password");

      if (password === env.FAMILY_PASSWORD) {
        return new Response(null, {
          status: 302,
          headers: {
            "Location": "/",
            "Set-Cookie":
              "family_access=granted; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000"
          }
        });
      }

      return new Response("Wrong password", {
        status: 401,
        headers: {
          "Content-Type": "text/plain"
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
        "Content-Type": "text/html"
      }
    });
  }
};