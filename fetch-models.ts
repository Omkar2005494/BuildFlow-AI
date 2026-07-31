async function main() {
  const res = await fetch("https://api.groq.com/openai/v1/models", {
    headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}` }
  });
  const data = await res.json();
  console.log("Active Models:", data.data?.map((m: any) => m.id));
}
main();
