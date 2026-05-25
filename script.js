const SUPABASE_URL = "https://wwtmsaywdtqcwmpmadhi.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_nXxvoCa6r8gZVAxMdiT2EA_IcUxT6Ir";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

window.onload = carregarJogadores;

async function carregarJogadores() {

    const { data, error } = await supabaseClient
        .from("jogadores")
        .select("*")
        .order("gols", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const tbody = document.querySelector("#tabela tbody");

    tbody.innerHTML = "";

    data.forEach((jogador, index) => {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${index + 1}</td>

            <td>${jogador.nome}</td>

            <td contenteditable="true"
                class="editable"
                data-id="${jogador.id}"
                data-col="partidas">
                ${jogador.partidas}
            </td>

            <td contenteditable="true"
                class="editable"
                data-id="${jogador.id}"
                data-col="gols">
                ${jogador.gols}
            </td>

            <td contenteditable="true"
                class="editable"
                data-id="${jogador.id}"
                data-col="assistencias">
                ${jogador.assistencias}
            </td>
        `;

        tbody.appendChild(linha);
    });

    ativarEdicao();

    atualizarTotais();
}

async function addPlayer() {

    const nome = prompt("Nome do novo jogador:");

    if (!nome) return;

    const { error } = await supabaseClient
        .from("jogadores")
        .insert([
            {
                nome: nome,
                partidas: 0,
                gols: 0,
                assistencias: 0
            }
        ]);

    if (error) {
        console.error(error);
        return;
    }

    carregarJogadores();
}

function ativarEdicao() {

    const campos = document.querySelectorAll(".editable");

    campos.forEach(campo => {

        campo.addEventListener("blur", async () => {

            const id = campo.dataset.id;

            const coluna = campo.dataset.col;

            const valor = parseInt(
                campo.innerText.replace(/\D/g, "")
            ) || 0;

            const { error } = await supabaseClient
                .from("jogadores")
                .update({
                    [coluna]: valor
                })
                .eq("id", id);

            if (error) {
                console.error(error);
                return;
            }

            atualizarTotais();
        });
    });
}

function atualizarTotais() {

    const linhas = document.querySelectorAll("#tabela tbody tr");

    let gols = 0;
    let assist = 0;
    let partidas = 0;

    linhas.forEach(linha => {

        partidas += parseInt(
            linha.cells[2].innerText
        ) || 0;

        gols += parseInt(
            linha.cells[3].innerText
        ) || 0;

        assist += parseInt(
            linha.cells[4].innerText
        ) || 0;
    });

    document.getElementById("totalGols").innerText = gols;

    document.getElementById("totalAssist").innerText = assist;

    document.getElementById("totalPartidas").innerText = partidas;
}
