window.aparelhos = [ 
    { nome: "Geladeira / Refrigerador", potencia: 150, fator: 0.4, horasPadrao: 24, diasPadrao: 30 }, 
    { nome: "Fogão por Indução (4 Bocas)", potencia: 7000, fator: 0.5, horasPadrao: 1, diasPadrao: 30 }, 
    { nome: "Forno Micro-ondas", potencia: 1200, fator: 1.0, horasPadrao: 0, minutosPadrao: 20, diasPadrao: 30 }, 
    { nome: "Máquina de Lavar Louça", potencia: 1500, fator: 0.6 }, 
    { nome: "Ar-Condicionado Split (9000 BTUs)", potencia: 800, fator: 0.7, horasPadrao: 8, diasPadrao: 30 }, 
    { nome: "Ar-Condicionado Split (12000 BTUs)", potencia: 1100, fator: 0.7 }, 
    { nome: "Máquina de Lavar Roupa", potencia: 500, fator: 0.4, horasPadrao: 1, diasPadrao: 12 }, 
    { nome: "Lava e Seca (Modo Secando)", potencia: 2000, fator: 0.9 }, 
    { nome: "Ferro de Passar a Vapor", potencia: 1500, fator: 0.8 }, 
    { nome: "Aspirador Robô", potencia: 40, fator: 1.0 }, 
    { nome: "Ventilador de Teto", potencia: 120, fator: 1.0 }, 
    { nome: "Chuveiro Elétrico (Opção Verão)", potencia: 3500, fator: 1.0 }, 
    { nome: "Chuveiro Elétrico (Inverno)", potencia: 5500, fator: 1.0, horasPadrao: 1, diasPadrao: 30 }, 
    { nome: "Televisão LED 50\"", potencia: 90, fator: 1.0 }, 
    { nome: "Computador Desktop (Gamer/Trabalho)", potencia: 400, fator: 0.6 }, 
    { nome: "Air Fryer (Fritadeira Sem Óleo)", potencia: 1500, fator: 0.8 } 
]; 

window.aparelhosAdicionados = JSON.parse(localStorage.getItem('ecoWatt_aparelhos')) || [];
let idEdicao = null;  

const TARIFA_PADRAO = 0.92; 

document.addEventListener('DOMContentLoaded', () => { 

    const FormsAparelho = document.getElementById('forms-aparelhos'); 
    const inputPesquisa = document.getElementById('pesquisa-aparelhos'); 
    const listaResultados = document.getElementById('resultado-pesquisa'); 
    const LimparPesquisaBotao = document.getElementById('limpar-pesquisa'); 
    const inputFatUso = document.getElementById('fator-uso'); 
    const porcentagemInput = document.getElementById('porcentagem-atual'); 
    const potenciaInput = document.getElementById('potencia'); 
    const horasInput = document.getElementById('horas'); 
    const minutosInput = document.getElementById('minutos'); 
    const diasInput = document.getElementById('dias'); 
    const botaoAdd = document.getElementById('botao-adicionar'); 
    const tituloForm = document.querySelector('.sidebar h3'); 
    const organizacaoAparelhos = document.getElementById('org-aparelhos'); 
    const LinhaPrecoTotal = document.getElementById('preco-total'); 
    const BotaoLimparTodos = document.getElementById('limpar-tudo'); 

    
    function salvarNoLocalStorage() {
        localStorage.setItem('ecoWatt_aparelhos', JSON.stringify(window.aparelhosAdicionados));
    }


    function atualizarVisualFatorUso(valorDecimal) {
        if (!porcentagemInput) return;
        
        const porcentagem = Math.round(valorDecimal * 100); 
        porcentagemInput.innerText = porcentagem + "%"; 

        if (valorDecimal <= 0.3) {
            porcentagemInput.style.backgroundColor = "#ef4444"; 
        } else if (valorDecimal <= 0.5) {
            porcentagemInput.style.backgroundColor = "#f59e0b";
        } else if (valorDecimal <= 0.8) {
            porcentagemInput.style.backgroundColor = "#eab308";
        } else {
            porcentagemInput.style.backgroundColor = "var(--verde-sustentavel)";
        }
    }

    window.renderizarCards = function() { 
        if (!organizacaoAparelhos) return; 
        organizacaoAparelhos.innerHTML = ""; 
        let totalGeral = 0; 

        window.aparelhosAdicionados.forEach(aparelho => { 
            totalGeral += aparelho.custoMensal; 

            const card = document.createElement('div'); 
            card.className = 'card-aparelho'; 
            card.innerHTML = ` 
                <h3>${aparelho.nome}</h3> 
                <p><strong>Potência:</strong> ${aparelho.potencia} W</p> 
                <p><strong>Uso diário:</strong> ${aparelho.horas}h ${aparelho.minutos}min</p> 
                <p><strong>Dias no mês:</strong> ${aparelho.dias} dias</p> 
                <p>Consumo: <strong>${aparelho.consumoKwh.toFixed(2)} kWh/mês</strong></p> 
                <div class="preco">R$ ${aparelho.custoMensal.toFixed(2).replace('.', ',')}</div> 
                <div class="acoes-cards"> 
                    <button type="button" class="editar-botao" data-id="${aparelho.id}">Editar</button> 
                    <button type="button" class="delete-botao" data-id="${aparelho.id}">Excluir</button> 
                </div> 
            `; 
            organizacaoAparelhos.appendChild(card); 
        }); 

        if (LinhaPrecoTotal) { 
            LinhaPrecoTotal.innerText = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`; 
        } 

        GerenciarEventosCards(); 
    }; 

    window.limparFormulario = function() { 
        idEdicao = null; 
        if (FormsAparelho) FormsAparelho.reset(); 
         
        if (tituloForm) tituloForm.innerText = "Adicionar Aparelho"; 
        if (botaoAdd) { 
            botaoAdd.innerText = "Calcular e Adicionar"; 
            botaoAdd.style.backgroundColor = "var(--verde-sustentavel)"; 
        } 
        

        if (inputFatUso) {
            inputFatUso.value = 1.0;
            atualizarVisualFatorUso(1.0);
        }
        
        if (LimparPesquisaBotao) LimparPesquisaBotao.style.display = "none"; 

        const CancelarBotao = document.getElementById('botao-cancelar-editar'); 
        if (CancelarBotao) CancelarBotao.remove(); 
    };

    if (inputFatUso) {
        atualizarVisualFatorUso(parseFloat(inputFatUso.value));
    }

    window.renderizarCards(); 

    if (inputFatUso) { 
        inputFatUso.addEventListener('input', (e) => { 
            atualizarVisualFatorUso(parseFloat(e.target.value));
        }); 
    } 

    if (inputPesquisa && listaResultados) { 
        inputPesquisa.addEventListener('input', () => { 
            const termo = inputPesquisa.value.toLowerCase(); 
            listaResultados.innerHTML = ""; 

            if (termo.length > 0) { 
                if (LimparPesquisaBotao) LimparPesquisaBotao.style.display = "block"; 
                 
                const filtrados = window.aparelhos.filter(a => a.nome.toLowerCase().includes(termo)); 

                filtrados.forEach(aparelho => { 
                    const li = document.createElement('li'); 
                    li.innerText = aparelho.nome; 
                    li.addEventListener('click', () => { 
                        inputPesquisa.value = aparelho.nome; 
                        if (potenciaInput) potenciaInput.value = aparelho.potencia; 
                        if (horasInput) horasInput.value = aparelho.horasPadrao || 0; 
                        if (minutosInput) minutosInput.value = aparelho.minutosPadrao || 0; 
                        if (diasInput) diasInput.value = aparelho.diasPadrao || 30; 
                        if (inputFatUso) { 
                            inputFatUso.value = aparelho.fator; 
                            atualizarVisualFatorUso(aparelho.fator);
                        } 
                        listaResultados.innerHTML = ""; 
                    }); 
                    listaResultados.appendChild(li); 
                }); 
            } else { 
                if (LimparPesquisaBotao) LimparPesquisaBotao.style.display = "none"; 
            } 
        }); 

        if (LimparPesquisaBotao) { 
            LimparPesquisaBotao.addEventListener('click', () => { 
                inputPesquisa.value = ""; 
                listaResultados.innerHTML = ""; 
                LimparPesquisaBotao.style.display = "none"; 
            }); 
        } 
    } 

    if (FormsAparelho) { 
        FormsAparelho.addEventListener('submit', (e) => { 
            e.preventDefault(); 

            const nome = inputPesquisa.value.trim(); 
            const potencia = parseFloat(potenciaInput.value); 
            const horas = parseFloat(horasInput.value) || 0; 
            const minutos = parseFloat(minutosInput.value) || 0; 
            const dias = parseInt(diasInput.value) || 30; 
            const fator = parseFloat(inputFatUso.value); 

            if (!nome || !potencia) return alert("Preencha o nome e a potência!"); 

            const tempoTotalHoras = horas + (minutos / 60); 
            const consumoKwh = (potencia * tempoTotalHoras * dias * fator) / 1000; 
            const custoMensal = consumoKwh * TARIFA_PADRAO;

            const dadosAparelho = { 
                id: idEdicao !== null ? idEdicao : Date.now(), 
                nome, potencia, horas, minutos, dias, fator, consumoKwh, custoMensal 
            }; 

            if (idEdicao !== null) { 
                const index = window.aparelhosAdicionados.findIndex(a => a.id === idEdicao); 
                if (index !== -1) window.aparelhosAdicionados[index] = dadosAparelho; 
            } else { 
                window.aparelhosAdicionados.push(dadosAparelho); 
            }

            salvarNoLocalStorage();


            window.limparFormulario(); 
            window.renderizarCards(); 
        }); 
    } 

    function GerenciarEventosCards() { 
        document.querySelectorAll('.editar-botao').forEach(btn => { 
            btn.addEventListener('click', () => prepararEdicao(parseInt(btn.getAttribute('data-id')))); 
        }); 

        document.querySelectorAll('.delete-botao').forEach(btn => { 
            btn.addEventListener('click', () => excluirAparelho(parseInt(btn.getAttribute('data-id')))); 
        }); 
    } 

    function excluirAparelho(id) { 
        if (confirm("Tem certeza que deseja remover este aparelho?")) { 
            window.aparelhosAdicionados = window.aparelhosAdicionados.filter(a => a.id !== id); 
            window.renderizarCards(); 
            if (idEdicao === id) window.limparFormulario(); 
        } 

        salvarNoLocalStorage();

    } 

    function prepararEdicao(id) { 
        const aparelho = window.aparelhosAdicionados.find(a => a.id === id); 
        if (!aparelho) return; 

        idEdicao = id; 
        inputPesquisa.value = aparelho.nome; 
        potenciaInput.value = aparelho.potencia; 
        horasInput.value = aparelho.horas; 
        minutosInput.value = aparelho.minutos; 
        diasInput.value = aparelho.dias; 
        inputFatUso.value = aparelho.fator; 
        
        atualizarVisualFatorUso(aparelho.fator);

        if (tituloForm) tituloForm.innerText = "Editar Objeto"; 
        if (botaoAdd) { 
            botaoAdd.innerText = "Salvar"; 
            botaoAdd.style.backgroundColor = "#003366";  
        } 

        if (!document.getElementById('botao-cancelar-editar')) { 
            const CancelarBotao = document.createElement('button'); 
            CancelarBotao.type = "button"; 
            CancelarBotao.id = "botao-cancelar-editar"; 
            CancelarBotao.className = "botao-secundario";
            CancelarBotao.style.width = "100%"; 
            CancelarBotao.style.marginTop = "10px"; 
            CancelarBotao.innerText = "Cancelar"; 
            CancelarBotao.addEventListener('click', window.limparFormulario); 
            FormsAparelho.appendChild(CancelarBotao); 
        } 
        inputPesquisa.focus(); 
    } 
    
    if (BotaoLimparTodos) { 
        BotaoLimparTodos.addEventListener('click', () => { 
            if (window.aparelhosAdicionados.length === 0) return; 
            if (confirm("Deseja realmente limpar todos os aparelhos do seu painel?")) { 
                window.aparelhosAdicionados = []; 

                salvarNoLocalStorage();

                window.renderizarCards(); 
                window.limparFormulario(); 
            } 
        }); 
    } 
});