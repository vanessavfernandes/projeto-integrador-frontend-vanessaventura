/*
 * ============================================================================
 * AULA 11 - FUNÇÕES PURAS, MÉTODOS DE ARRAY (MAP, FILTER, REDUCE) E DOM BÁSICO
 * Tema: Catálogo de Quadros Decorativos e Letreiros Personalizados em MDF
 * Padrão: Processar -> Classificar -> Mostrar na Página
 * ============================================================================
 */

// 1. Dados do catálogo (array de 6 objetos em camelCase, sem acentos nas chaves)
const pecasCatalogoMdf = [
    { nome: "Letreiro Jesus com Suporte", categoria: "Letreiros", preco: 45.00, estoque: 8 },
    { nome: "Quadro Vazado Ciclista 50x70", categoria: "Quadros", preco: 120.00, estoque: 2 },
    { nome: "Letreiro Cantinho do Café", categoria: "Letreiros", preco: 38.00, estoque: 0 },
    { nome: "Quadro Vazado Geométrico 20x30", categoria: "Quadros", preco: 65.00, estoque: 5 },
    { nome: "Letreiro Família MDF 2.5mm", categoria: "Letreiros", preco: 52.00, estoque: 3 },
    { nome: "Kit Chaveiros Personalizados", categoria: "Chaveiros", preco: 25.00, estoque: 15 }
];

// ============================================================================
// BLOCO A: FUNÇÕES PURAS DE CÁLCULO E CLASSIFICAÇÃO (SEM MEXER NO DOM)
// ============================================================================

// Desafio Extra: Fábrica com closure para gerar calculadoras de desconto configuráveis
function criarCalculadoraDesconto(percentualPadrao = 10) {
    return function calcularPrecoPromocional(precoOriginal, desconto = percentualPadrao) {
        const valorDesconto = precoOriginal * (desconto / 100);
        return Number((precoOriginal - valorDesconto).toFixed(2));
    };
}

// Função 1 (Processa): recebe preço e retorna valor com desconto padrão de 10% sem mutar dados
const calcularPrecoComDesconto = criarCalculadoraDesconto(10);

// Função 2 (Classifica): recebe o preço final e devolve faixa e classe CSS (3 faixas)
function classificarFaixaPreco(precoFinal) {
    if (precoFinal < 40) {
        return { rotulo: "Econômico", classeCss: "faixa-economico" };
    } else if (precoFinal <= 80) {
        return { rotulo: "Intermediário", classeCss: "faixa-intermediario" };
    } else {
        return { rotulo: "Premium", classeCss: "faixa-premium" };
    }
}

// Função auxiliar para formatar moeda em Real brasileiro
function formatarReais(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ============================================================================
// BLOCO B: TRANSFORMAÇÃO COM MAP, FILTER E REDUCE (SEM MUTAR O ARRAY ORIGINAL)
// ============================================================================

// map: processa e classifica cada item do catálogo
const pecasAnalisadas = pecasCatalogoMdf.map((peca) => {
    const precoPromocional = calcularPrecoComDesconto(peca.preco);
    const classificacao = classificarFaixaPreco(precoPromocional);
    const valorTotalItemEstoque = Number((precoPromocional * peca.estoque).toFixed(2));

    return {
        ...peca,
        precoPromocional,
        rotuloFaixa: classificacao.rotulo,
        classeCss: classificacao.classeCss,
        valorTotalItemEstoque
    };
});

// filter: separa apenas as peças disponíveis em estoque (estoque > 0)
const pecasDisponiveis = pecasAnalisadas.filter((peca) => peca.estoque > 0);

// reduce 1: calcula resumo geral (valor total em estoque promocional e total de unidades)
const resumoEstoque = pecasDisponiveis.reduce(
    (acumulador, peca) => {
        acumulador.valorTotal += peca.valorTotalItemEstoque;
        acumulador.totalUnidades += peca.estoque;
        return acumulador;
    },
    { valorTotal: 0, totalUnidades: 0 }
);

// reduce 2 (Desafio Extra): agrupa os itens por categoria em um objeto
const itensPorCategoria = pecasAnalisadas.reduce((grupos, peca) => {
    if (!grupos[peca.categoria]) {
        grupos[peca.categoria] = [];
    }
    grupos[peca.categoria].push(peca);
    return grupos;
}, {});

// ============================================================================
// BLOCO C: MANIPULAÇÃO DO DOM (SELECIONAR, CRIAR E INSERIR ELEMENTOS)
// ============================================================================

// Função 3 (Monta elemento DOM): cria um cartão de item com createElement e textContent
function criarCardAnalisePeca(peca) {
    const artigo = document.createElement("article");
    artigo.classList.add("item-analise-mdf", peca.classeCss);

    const cabecalho = document.createElement("div");
    cabecalho.classList.add("item-analise-topo");

    const titulo = document.createElement("h3");
    titulo.textContent = peca.nome;

    const selo = document.createElement("span");
    selo.classList.add("selo-faixa");
    selo.textContent = peca.rotuloFaixa;

    cabecalho.append(titulo, selo);

    const detalhes = document.createElement("p");
    detalhes.textContent =
        `Categoria: ${peca.categoria} | De ${formatarReais(peca.preco)} por ${formatarReais(peca.precoPromocional)}`;

    const rodapeEstoque = document.createElement("p");
    rodapeEstoque.classList.add("item-analise-estoque");
    rodapeEstoque.textContent =
        peca.estoque > 0
            ? `Disponível: ${peca.estoque} un. (Subtotal em estoque: ${formatarReais(peca.valorTotalItemEstoque)})`
            : "Status: Esgotado sob encomenda";

    artigo.append(cabecalho, detalhes, rodapeEstoque);
    return artigo;
}

// Função principal de renderização na página com validação de null
function renderizarAnaliseNoDom() {
    const containerLista = document.querySelector("#lista-analise-mdf");
    const containerResumo = document.querySelector("#resumo-analise-mdf");
    const containerCategorias = document.querySelector("#categorias-analise-mdf");

    if (!containerLista || !containerResumo || !containerCategorias) {
        console.error("Erro: Área de resultado (#resultado) não encontrada no HTML.");
        return;
    }

    // 1. Insere cada card analisado na página
    pecasAnalisadas.forEach((peca) => {
        const cardElemento = criarCardAnalisePeca(peca);
        containerLista.append(cardElemento);
    });

    // 2. Insere o resumo calculado com reduce
    const textoResumo = document.createElement("p");
    textoResumo.textContent =
        `Resumo do Estoque Disponível: ${pecasDisponiveis.length} modelos ativos ` +
        `(${resumoEstoque.totalUnidades} unidades) totalizando ${formatarReais(resumoEstoque.valorTotal)} com desconto.`;
    containerResumo.append(textoResumo);

    // 3. Desafio Extra: renderiza um bloco por categoria agrupada via reduce
    Object.entries(itensPorCategoria).forEach(([categoria, listaPecas]) => {
        const blocoCategoria = document.createElement("div");
        blocoCategoria.classList.add("bloco-categoria-mdf");

        const tituloCat = document.createElement("h4");
        tituloCat.textContent = `${categoria} (${listaPecas.length} modelos)`;

        const nomesCat = document.createElement("p");
        nomesCat.textContent = listaPecas.map((item) => item.nome).join(" • ");

        blocoCategoria.append(tituloCat, nomesCat);
        containerCategorias.append(blocoCategoria);
    });
}

// Executa a montagem na página após o carregamento do DOM (garantido pelo defer)
renderizarAnaliseNoDom();