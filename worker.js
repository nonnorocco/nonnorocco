export default {
  async fetch() {
    return new Response("HELLO FROM WORKER");
  }
};