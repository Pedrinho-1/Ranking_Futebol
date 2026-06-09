const SUPABASE_URL = "https://wvtmsaywdtqcwmppmadhi.supabase.co";
const SUPABASE_KEY = "sb_publishable_nXxvoCa6r8gZVAxMdiT2EA_IcUxT6Ir";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function carregarJogadores() {
  const { data, error } = await supabaseClient
    .from("jogadores")
    .select("*")
    .order("gols", { ascending: false });

  if (error) {
    console.error("Erro ao carregar:", error);
    alert("Erro ao carregar dados do Supabase.");
    return;
  }

  const tbody = document.querySelector("#tabela tbody");
  tbody.innerHTML = "";

  data.forEach((jogador, index) => {
    let posicao = index + 1;

    if (index === 0) posicao = "🥇";
    if (index === 1) posicao = "🥈";
    if (index === 2) posicao = "🥉";

    tbody.innerHTML += `
      <tr>
        <td>${posicao}</td>
        <td>${jogador.nome}</td>

        <td contenteditable="true" onblur="atualizarJogador(${jogador.id}, 'partidas', this.innerText)">
          ${jogador.partidas}
        </td>

        <td contenteditable="true" onblur="atualizarJogador(${jogador.id}, 'gols', this.innerText)">
          ${jogador.gols}
        </td>

        <td contenteditable="true" onblur="atualizarJogador(${jogador.id}, 'assistencias', this.innerText)">
          ${jogador.assistencias}
        </td>
      </tr>
    `;
  });

  atualizarTotais();
}

async function atualizarJogador(id, campo, valor) {
  valor = Number(valor) || 0;

  const { error } = await supabaseClient
    .from("jogadores")
    .update({ [campo]: valor })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar:", error);
    alert("Erro ao salvar alteração.");
    return;
  }

  carregarJogadores();
}

async function addPlayer() {
  const nome = prompt("Digite o nome do novo jogador:");

  if (!nome || nome.trim() === "") {
    alert("Nome inválido.");
    return;
  }

  const { error } = await supabaseClient
    .from("jogadores")
    .insert([
      {
        nome: nome.trim(),
        partidas: 0,
        gols: 0,
        assistencias: 0
      }
    ]);

  if (error) {
    console.error("Erro ao adicionar jogador:", error);
    alert("Erro ao adicionar jogador.");
    return;
  }

  carregarJogadores();
}

function atualizarTotais() {
  let totalGols = 0;
  let totalAssist = 0;
  let totalPartidas = 0;

  document.querySelectorAll("#tabela tbody tr").forEach(row => {
    totalPartidas += Number(row.children[2].innerText) || 0;
    totalGols += Number(row.children[3].innerText) || 0;
    totalAssist += Number(row.children[4].innerText) || 0;
  });

  document.getElementById("totalGols").innerText = totalGols;
  document.getElementById("totalAssist").innerText = totalAssist;
  document.getElementById("totalPartidas").innerText = totalPartidas;
}

carregarJogadores();

supabaseClient
  .channel("ranking-tempo-real")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "jogadores"
    },
    () => carregarJogadores()
  )
  .subscribe();
