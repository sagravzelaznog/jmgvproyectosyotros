async function main() {
  while (true) {
    try {
      const res = await fetch('https://jmgvproyectosyotros.vercel.app/api/ping');
      const data = await res.json();
      console.log("Ping:", data.version);
      if (data.version === "dynamic-import-deployed") {
        console.log("DEPLOYED!");
        break;
      }
    } catch (e) {
      console.log("Error:", e.message);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
}
main();
