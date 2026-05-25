window.onload = atualizarTotais;

function addPlayer() {

    let nome = prompt("Nome do novo craque:");

    if (!nome) return;

    let tabela = document
        .getElementById("tabela")
        .getElementsByTagName("tbody")[0];

    let novaLinha = tabela.insertRow();

    let pos = tabela.rows.length;

    novaLinha.innerHTML = `
        <td>${pos}</td>
        <td>${nome}</td>
        <td contenteditable="true" class="editable">0</td>
        <td contenteditable="true" class="editable">0</td>
        <td contenteditable="true" class="editable">0</td>
    `;

    atualizarTotais();
}

function atualizarTotais() {

    let tabela = document
        .getElementById("tabela")
        .getElementsByTagName("tbody")[0];

    let gols = 0;
    let assist = 0;
    let partidas = 0;

    for (let i = 0; i < tabela.rows.length; i++) {

        let p = parseInt(
            tabela.rows[i].cells[2].innerText.replace(/\D/g, '')
        ) || 0;

        let g = parseInt(
            tabela.rows[i].cells[3].innerText.replace(/\D/g, '')
        ) || 0;

        let a = parseInt(
            tabela.rows[i].cells[4].innerText.replace(/\D/g, '')
        ) || 0;

        partidas += p;
        gols += g;
        assist += a;
    }

    document.getElementById("totalGols").innerText = gols;
    document.getElementById("totalAssist").innerText = assist;
    document.getElementById("totalPartidas").innerText = partidas;
}
