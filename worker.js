export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const cookie = request.headers.get("Cookie") || "";

    // Check authentication cookie
    if (cookie.includes(`family_access=${env.SESSION_TOKEN}`)) {
      const response = await env.ASSETS.fetch(request);

      // Prevent private pages from being cached publicly
      const headers = new Headers(response.headers);
      headers.set("Cache-Control", "private, no-store");

      return new Response(response.body, {
        status: response.status,
        headers
      });
    }

    // Handle login form submission
    if (request.method === "POST" && url.pathname === "/login") {
      const form = await request.formData();
      const password = form.get("password");

      if (password === env.FAMILY_PASSWORD) {
        return new Response(null, {
          status: 302,
          headers: {
            "Location": "/",
            "Set-Cookie":
              `family_access=${env.SESSION_TOKEN}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`,
            "Cache-Control": "no-store"
          }
        });
      }

      return new Response(`
        <!doctype html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Family Archive · Access denied</title>
          <style>
            :root {
              color-scheme: light;
              --bg: #f7f3ea;
              --card: rgba(255, 255, 255, 0.95);
              --text: #2f2a22;
              --muted: #766b5e;
              --accent: #7a4d2b;
              --accent-2: #a8643b;
            }

            * { box-sizing: border-box; }
            body {
              margin: 0;
              min-height: 100vh;
              display: grid;
              place-items: center;
              padding: 24px;
              font-family: "Inter", "Segoe UI", sans-serif;
              background: linear-gradient(135deg, var(--bg), #efe4d3);
              color: var(--text);
            }

            .card {
              width: min(100%, 420px);
              padding: 32px;
              border-radius: 24px;
              background: var(--card);
              box-shadow: 0 20px 45px rgba(46, 29, 14, 0.14);
              text-align: center;
            }

            .eyebrow {
              display: inline-block;
              padding: 6px 10px;
              border-radius: 999px;
              background: #f3e7da;
              color: var(--accent);
              font-size: 0.8rem;
              font-weight: 700;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              margin-bottom: 12px;
            }

            h1 { margin: 0 0 8px; font-size: 1.7rem; }
            p { margin: 0 0 20px; color: var(--muted); line-height: 1.6; }
            .hint { font-size: 0.95rem; color: var(--muted); margin-top: 14px; }
            a {
              color: var(--accent);
              font-weight: 600;
              text-decoration: none;
            }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <main class="card">
            <div class="eyebrow">Access denied</div>
            <h1>That password didn’t match</h1>
            <p>Please try again to enter the family archive.</p>
            <div class="hint"><a href="/">Return to the login page</a></div>
          </main>
        </body>
        </html>
      `, {
        status: 401,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store"
        }
      });
    }

    // Login page
    return new Response(`
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Family Archive</title>
        <style>
          :root {
            color-scheme: light;
            --bg: #f7f3ea;
            --card: rgba(255, 255, 255, 0.95);
            --text: #2f2a22;
            --muted: #766b5e;
            --accent: #7a4d2b;
            --accent-2: #a8643b;
          }

          * { box-sizing: border-box; }

          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
            font-family: "Inter", "Segoe UI", sans-serif;
            background: linear-gradient(135deg, var(--bg), #efe4d3);
            color: var(--text);
          }

          .card {
            width: min(100%, 420px);
            padding: 32px;
            border-radius: 24px;
            background: var(--card);
            box-shadow: 0 20px 45px rgba(46, 29, 14, 0.14);
            text-align: center;
          }

          .eyebrow {
            display: inline-block;
            padding: 6px 10px;
            border-radius: 999px;
            background: #f3e7da;
            color: var(--accent);
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin-bottom: 12px;
          }

          h1 { margin: 0 0 8px; font-size: 1.7rem; }
          p { margin: 0 0 20px; color: var(--muted); line-height: 1.6; }

          form {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          input, button {
            font: inherit;
            border-radius: 999px;
            border: 1px solid #e2d6c8;
            padding: 12px 16px;
          }

          input {
            background: #fcfaf7;
            color: var(--text);
          }

          input:focus {
            outline: 2px solid rgba(122, 77, 43, 0.2);
            border-color: var(--accent);
          }

          button {
            cursor: pointer;
            font-weight: 700;
            color: white;
            background: linear-gradient(135deg, var(--accent), var(--accent-2));
            border: none;
            box-shadow: 0 10px 20px rgba(122, 77, 43, 0.18);
          }

          button:hover {
            transform: translateY(-1px);
          }
        </style>
      </head>

      <body>
        <main class="card">
          <div class="eyebrow">Private archive</div>
          <h1>Family Archive</h1>
          <p>Enter the family password to explore the shared memories and stories.</p>

          <form method="POST" action="/login">
            <input
              type="password"
              name="password"
              placeholder="Password"
              autocomplete="current-password"
              required
            >
            <button type="submit">Enter archive</button>
          </form>
        </main>
      </body>
      </html>
    `, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }
};