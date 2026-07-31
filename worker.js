export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Already authenticated?
    const cookie = request.headers.get("Cookie") || "";

    if (cookie.includes("family_access=granted")) {
      return env.ASSETS.fetch(request);
    }

    // Login form submission
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
    return new Response(
      `
      <!doctype html>
      <html>
      <head>
        <title>Family Archive</title>
        <style>
          body {
            font-family: sans-serif;
            max-width: 400px;
            margin: 80px auto;
            text-align: center;
          }
          input, button {
            padding: 10px;
            margin: 5px;
          }
        </style>
      </head>
      <body>
        <h1>Family Archive</h1>
        <form method="POST" action="/login">
          <input 
            type="password" 
            name="password"
            placeholder="Password">
          <br>
          <button type="submit">
            Enter
          </button>
        </form>
      </body>
      </html>
      `,
      {
        headers: {
          "Content-Type": "text/html"
        }
      }
    );
  }
};