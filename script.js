const API = "/api";
const status = document.getElementById("status");
const latest = document.getElementById("latest");
const list = document.getElementById("list");
const input = document.getElementById("input");

async function refresh() {
  try {
    const r = await fetch(`${API}/`);
    status.textContent = `GET / -> ${r.status} ${JSON.stringify(await r.json())}`;
  } catch {
    status.textContent = "GET / -> connection failed";
  }

  const notes = await (await fetch(`${API}/notes`)).json();
  const last = notes[notes.length - 1];
  latest.textContent = last ? last.text : "No notes yet.";
  list.innerHTML = notes
    .slice(0, -1)
    .reverse()
    .map((n) => `<li><span>${n.text}</span><button class="del" data-id="${n.note_id}">×</button></li>`)
    .join("");
}

list.onclick = async (e) => {
  if (!e.target.classList.contains("del")) return;
  await fetch(`${API}/notes/${e.target.dataset.id}`, { method: "DELETE" });
  refresh();
};

document.getElementById("save").onclick = async () => {
  const text = input.value.trim();
  if (!text) return;
  await fetch(`${API}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  input.value = "";
  refresh();
};

latest.onclick = () => navigator.clipboard.writeText(latest.textContent);

refresh();
