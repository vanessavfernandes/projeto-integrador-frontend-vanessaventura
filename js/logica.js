/*
 * ============================================================================
 * AULA 09 - MINI-ANALISADOR DE DADOS EM JAVASCRIPT PURO
 * Tema: Catálogo de Quadros Decorativos e Letreiros Personalizados em MDF
 * Entrada: Preço máximo desejado pelo cliente via prompt() e comandos de menu
 *          interativo via do...while.
 * Processamento: Classifica cada peça do catálogo por faixa de estoque
 *                (if / else if / else), identifica a linha de produção
 *                (switch), filtra itens dentro do orçamento informado e
 *                calcula indicadores (valor total em estoque, peça mais cara,
 *                contagem de itens dentro do orçamento e média de preços).
 * Saída esperada: Relatório estruturado no console com console.table(),
 *                 frases resumidas com template literals e mensagens no menu.
 *
 * PSEUDOCÓDIGO:
 * 1. DEFINIR lista com 6 peças de MDF (nome, categoria, preco, estoque).
 * 2. LER precoMaximo do usuário, converter com Number() e validar nulo/vazio/NaN/faixa.
 * 3. INICIALIZAR acumuladores (valorTotalEstoque, somaPrecos, itensNoOrcamento, maisCaro).
 * 4. PARA CADA peca DA lista:
 *      CLASSIFICAR estoque em "Esgotado" (=== 0), "Estoque Baixo" (<= 3) ou "Disponível".
 *      IDENTIFICAR setor de acabamento via switch na categoria ("letreiro", "quadro", "chaveiro").
 *      SOMAR valor em estoque e atualizar item mais caro e contador do orçamento.
 * 5. EXIBIR tabela detalhada (console.table) e resumo geral com template literals.
 * 6. EXECUTAR menu interativo com do...while até o usuário escolher sair ("3" ou "sair").
 * ============================================================================
 */

// 1. Declaração dos dados do catálogo (array de 6 objetos em camelCase)
const catalogoMdf = [
    { nome: "Letreiro Jesus com Suporte", categoria: "letreiro", preco: 45.00, estoque: 8 },
    { nome: "Quadro Vazado Ciclista 50x70", categoria: "quadro", preco: 120.00, estoque: 2 },
    { nome: "Letreiro Cantinho do Café", categoria: "letreiro", preco: 38.00, estoque: 0 },
    { nome: "Quadro Vazado Geométrico 20x30", categoria: "quadro", preco: 65.00, estoque: 5 },
    { nome: "Letreiro Família MDF 2.5mm", categoria: "letreiro", preco: 52.00, estoque: 3 },
    { nome: "Kit Chaveiros Personalizados", categoria: "chaveiro", preco: 25.00, estoque: 15 }
];

// 2. Entrada com prompt, conversão com Number() e validação completa (sem Erro 2)
const entradaOrcamento = prompt(
    "Catálogo MDF - Análise de Preços\nDigite o valor máximo por peça (entre R$ 10 e R$ 500):"
);

let orcamentoMaximo = 100; // Valor padrão caso a entrada seja cancelada ou inválida

if (entradaOrcamento === null || entradaOrcamento.trim() === "") {
    console.warn("Entrada vazia ou cancelada. Usando valor padrão de R$ 100,00.");
} else {
    const valorConvertido = Number(entradaOrcamento);
    if (Number.isNaN(valorConvertido) || valorConvertido < 10 || valorConvertido > 500) {
        console.warn("Valor fora da faixa (R$ 10 a R$ 500) ou não numérico. Usando R$ 100,00.");
    } else {
        orcamentoMaximo = valorConvertido;
    }
}

// 3. Padrões de laço: acumuladores, contadores e máximo
let valorTotalEstoque = 0;
let somaPrecos = 0;
let totalNoOrcamento = 0;
let pecaMaisCara = catalogoMdf[0];
const relatorioAnalise = [];

// 4. Laço for...of percorrendo todos os itens sem risco de erro de índice (sem Erro 3)
for (const peca of catalogoMdf) {
    // Classificação de estoque com if / else if / else (ordem correta e ===, sem Erro 1)
    let statusEstoque = "";
    if (peca.estoque === 0) {
        statusEstoque = "Esgotado";
    } else if (peca.estoque <= 3) {
        statusEstoque = "Estoque Baixo";
    } else {
        statusEstoque = "Normal";
    }

    // Classificação por categoria com switch + break em todos os cases + default (sem Erro 5)
    let setorProducao = "";
    switch (peca.categoria) {
        case "letreiro":
            setorProducao = "Corte a Laser + Base Encaixável";
            break;
        case "quadro":
            setorProducao = "Corte Vazado MDF 3mm Fosco";
            break;
        case "chaveiro":
            setorProducao = "Corte Série + Argola Metálica";
            break;
        default:
            setorProducao = "Acabamento Sob Medida";
            break;
    }

    // Operador ternário para verificar se cabe no orçamento informado
    const cabeNoOrcamento = peca.preco <= orcamentoMaximo ? "Sim" : "Não";

    // Atualização dos acumuladores e contadores
    const subtotalPeca = peca.preco * peca.estoque;
    valorTotalEstoque += subtotalPeca;
    somaPrecos += peca.preco;

    if (peca.preco <= orcamentoMaximo) {
        totalNoOrcamento++;
    }

    if (peca.preco > pecaMaisCara.preco) {
        pecaMaisCara = peca;
    }

    relatorioAnalise.push({
        Produto: peca.nome,
        Categoria: peca.categoria,
        PrecoUnitario: `R$ ${peca.preco.toFixed(2)}`,
        Estoque: peca.estoque,
        Status: statusEstoque,
        Setor: setorProducao,
        DentroDoOrcamento: cabeNoOrcamento
    });
}

const mediaPrecos = somaPrecos / catalogoMdf.length;

// 5. Exibição dos resultados com console.table e template literals
console.log("=== RELATÓRIO DO CATÁLOGO DE MDF ===");
console.table(relatorioAnalise);
console.log(`Orçamento máximo pesquisado: R$ ${orcamentoMaximo.toFixed(2)}`);
console.log(`Peças dentro do orçamento: ${totalNoOrcamento} de ${catalogoMdf.length} modelos.`);
console.log(`Valor total imobilizado em estoque: R$ ${valorTotalEstoque.toFixed(2)}`);
console.log(`Peça de maior valor: ${pecaMaisCara.nome} (R$ ${pecaMaisCara.preco.toFixed(2)})`);
console.log(`Ticket médio do catálogo: R$ ${mediaPrecos.toFixed(2)}`);

// 6. Desafio Extra: Menu interativo com do...while + switch + operador ?? (sem Erro 4)
let opcaoMenu = "";
do {
    const entradaMenu = prompt(
        "Menu Rápido do Catálogo MDF:\n" +
        "1 - Ver resumo do estoque no console\n" +
        "2 - Consultar peça mais cara\n" +
        "3 - Sair\n\n" +
        "Digite o número da opção ou 'sair':"
    );

    // Uso do operador de coalescência nula (??) caso o usuário clique em Cancelar
    opcaoMenu = (entradaMenu ?? "3").trim().toLowerCase();

    switch (opcaoMenu) {
        case "1":
            console.log(
                `[Resumo] Total em estoque: R$ ${valorTotalEstoque.toFixed(2)} | Média: R$ ${mediaPrecos.toFixed(2)}`
            );
            break;
        case "2":
            console.log(
                `[Destaque] Maior valor: ${pecaMaisCara.nome} - R$ ${pecaMaisCara.preco.toFixed(2)}`
            );
            break;
        case "3":
        case "sair":
            console.log("Consulta ao catálogo encerrada.");
            break;
        default:
            console.log("Opção inválida. Escolha 1, 2 ou 3.");
            break;
    }
} while (opcaoMenu !== "3" && opcaoMenu !== "sair");

