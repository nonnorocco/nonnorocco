export default {
  async fetch(request) {
    return new Response(
      "Worker: " + new URL(request.url).pathname,
      { headers: { "Content-Type": "text/plain" } }
    );
  }
};