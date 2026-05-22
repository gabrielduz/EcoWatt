
document.addEventListener('DOMContentLoaded', () => {
    const relatorioPDFbotao = document.getElementById('relatorio-botao'); 

    if (relatorioPDFbotao) { 
        relatorioPDFbotao.addEventListener('click', function() { 
            if (!window.aparelhosAdicionados || window.aparelhosAdicionados.length === 0) {
                return alert("Adicione pelo menos um aparelho para exportar o relatório!");
            }

            relatorioPDFbotao.disabled = true; 
            const textoOriginal = relatorioPDFbotao.innerHTML; 
            relatorioPDFbotao.innerHTML = "Gerando PDF..."; 
            let totalKwhMes = 0; 
            let totalCustoMes = 0; 
            window.aparelhosAdicionados.forEach(a => { 
                totalKwhMes += a.consumoKwh; 
                totalCustoMes += a.custoMensal; 
            }); 

            const pegadaCarbonoCo2 = totalKwhMes * 0.09; 

            const dicasManter = [ 
                "Continue utilizando lâmpadas LED em toda a residência.", 
                "Parabéns por manter o chuveiro na posição 'Verão' nos dias quentes.", 
                "Ótimo hábito de retirar os carregadores da tomada após o uso.", 
                "Muito bem! A borracha de vedação da sua geladeira está cumprindo o papel.", 
                "Parabéns por acumular o máximo de roupas antes de usar a máquina de lavar.", 
                "Excelente costume de aproveitar a luz natural do dia nas tarefas domésticas.", 
                "Continue limpando os filtros do ar-condicionado mensalmente.", 
                "Ótimo gerenciamento do modo 'Standby' dos aparelhos da sala.", 
                "Muito bem por usar o ferro de passar roupas apenas uma vez por semana.", 
                "Parabéns por monitorar o seu consumo mensal ativamente pelo EcoWatt!" 
            ]; 

            const dicasMelhorar = [ 
                "Substitua lâmpadas fluorescentes ou incandescentes antigas por LED.", 
                "Reduza o tempo de banho no chuveiro elétrico em pelo menos 3 minutos.", 
                "Evite colocar alimentos quentes dentro da geladeira para não sobrecarregar o motor.", 
                "Desligue aparelhos da tomada que ficam apenas exibindo a hora no painel (Standby).", 
                "Utilize a máquina de lavar louça ou roupas apenas na capacidade máxima de carga.", 
                "Ao comprar novos aparelhos, dê preferência absoluta aos que possuem o Selo Procel 'A'.", 
                "Regule o termostato da geladeira/freezer de acordo com a estação do ano.", 
                "Evite secar roupas na parte traseira da geladeira, pois isso aumenta muito o consumo.", 
                "Considere pintar paredes internas com cores claras para refletir melhor a iluminação.", 
                "Instale sensores de presença ou dimmers em corredores e áreas de pouca circulação." 
            ]; 

            let ecoNivel = ""; let ecoCor = ""; let ecoMensagem = ""; 
            let ecoLogNivel = ""; let ecoLogCor = ""; let ecoLogMensagem = ""; 
            let dicasSelecionadas = []; 

            if (totalKwhMes <= 150) { 
                ecoNivel = "Excelente / Muito Positivo"; ecoCor = "#27ae60"; 
                ecoMensagem = `Seu consumo mensal de <strong>${totalKwhMes.toFixed(2)} kWh</strong> (R$ ${totalCustoMes.toFixed(2).replace('.', ',')}) está excelente! Você está operando dentro da meta ideal consciente, mantendo seus gastos sob controle severo e gerando um impacto financeiro mínimo no orçamento doméstico.`; 
                ecoLogNivel = "Pegada Verde Plena"; ecoLogCor = "#27ae60"; 
                ecoLogMensagem = `Parabéns! Sua pegada de carbono é de apenas <strong>${pegadaCarbonoCo2.toFixed(2)} kg de CO₂</strong>. Sua atitude contribui diretamente para a redução do acionamento de usinas termelétricas poluentes.`; 
                dicasSelecionadas = [...dicasManter]; 
            } else if (totalKwhMes > 150 && totalKwhMes <= 220) { 
                ecoNivel = "Razoavelmente Bom"; ecoCor = "#2ecc71"; 
                ecoMensagem = `Seu consumo mensal é de <strong>${totalKwhMes.toFixed(2)} kWh</strong> (R$ ${totalCustoMes.toFixed(2).replace('.', ',')}). Este é um patamar considerado consciente e equilibrado para uma residência padrão. Há pequenas oportunidades de otimização, mas a base do consumo está correta.`; 
                ecoLogNivel = "Impacto Moderado"; ecoLogCor = "#2ecc71"; 
                ecoLogMensagem = `Impacto ecológico sob controle parcial. A geração da energia para sua residência emitiu cerca de <strong>${pegadaCarbonoCo2.toFixed(2)} kg de CO₂</strong> este mês.`; 
                dicasSelecionadas = [...dicasManter.slice(0, 5), ...dicasMelhorar.slice(0, 5)]; 
            } else if (totalKwhMes > 220 && totalKwhMes <= 350) { 
                ecoNivel = "Alto / Razoavelmente Ruim"; ecoCor = "#e67e22"; 
                ecoMensagem = `Atenção: Seu consumo atingiu <strong>${totalKwhMes.toFixed(2)} kWh</strong>, totalizando R$ ${totalCustoMes.toFixed(2).replace('.', ',')}. Esse patamar indica desperdícios localizados ou o uso prolongado de equipamentos de alta potência. É hora de reajustar hábitos.`; 
                ecoLogNivel = "Alto Impacto Ambiental"; ecoLogCor = "#e67e22"; 
                ecoLogMensagem = `Alerta Ambiental. Seu padrão de consumo atual demanda muito da infraestrutura energética nacional, gerando <strong>${pegadaCarbonoCo2.toFixed(2)} kg de CO₂</strong> e forçando a queima de combustíveis fósseis.`; 
                dicasSelecionadas = [...dicasMelhorar.slice(0, 7), ...dicasManter.slice(0, 3)]; 
            } else { 
                ecoNivel = "Crítico / Muito Ruim"; ecoCor = "#e74c3c"; 
                ecoMensagem = `Alerta Vermelho: Seu consumo está em <strong>${totalKwhMes.toFixed(2)} kWh</strong>, totalizando R$ ${totalCustoMes.toFixed(2).replace('.', ',')} mensais. Este nível de gasto é insustentável a longo prazo, pesando severamente no bolso e indicando uso ineficiente da rede elétrica.`; 
                ecoLogNivel = "Sobrecarga Ecológica"; ecoLogCor = "#e74c3c"; 
                ecoLogMensagem = `Impacto crítico! Seu consumo gerou uma alta emissão de gases estufa (<strong>${pegadaCarbonoCo2.toFixed(2)} kg de CO₂</strong>). O desperdício e o uso excessivo de energia aceleram o esgotamento de recursos naturais.`; 
                dicasSelecionadas = [...dicasMelhorar]; 
            } 

            let listaDicasHtml = ""; 
            dicasSelecionadas.forEach(dica => { 
                listaDicasHtml += `<li style="margin-bottom: 8px; font-size: 13px; line-height: 1.4; color: #444;">${dica}</li>`; 
            }); 

            let tabelaLinhasHtml = ""; 
            window.aparelhosAdicionados.forEach(a => { 
                const partMensal = totalKwhMes > 0 ? ((a.consumoKwh / totalKwhMes) * 100).toFixed(1) : 0; 
                tabelaLinhasHtml += ` 
                    <tr> 
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${a.nome}</td> 
                        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${a.horas}h ${a.minutos}m (${a.dias} dias)</td> 
                        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${a.consumoKwh.toFixed(2)} kWh (${partMensal}%)</td> 
                        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #27ae60;">R$ ${a.custoMensal.toFixed(2).replace('.', ',')}</td> 
                    </tr> 
                `; 
            }); 


            const templateHtml = document.getElementById('div-relatorio'); 
            templateHtml.innerHTML = ` 
                <div style="padding: 30px; font-family: Arial, sans-serif; color: #333; background-color: #fff;"> 
                    <div style="border-bottom: 3px solid #27ae60; padding-bottom: 15px; margin-bottom: 30px; display: table; width: 100%;"> 
                        <div style="display: table-cell; vertical-align: middle;"> 
                            <h1 style="margin: 0; color: #003366; font-size: 24px;">EcoWatt - Relatório de Eficiência Energética</h1> 
                            <p style="margin: 5px 0 0 0; color: #666; font-size: 13px;">Análise personalizada de consumo residencial</p> 
                        </div> 
                        <div style="display: table-cell; text-align: right; vertical-align: middle; color: #888; font-size: 12px;"> 
                            Data: ${new Date().toLocaleDateString('pt-BR')} 
                        </div> 
                    </div> 

                    <div style="margin-bottom: 30px; display: table; width: 100%; border-collapse: separate; border-spacing: 15px 0;"> 
                        <div style="display: table-cell; width: 33%; background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #003366;"> 
                            <span style="font-size: 11px; text-transform: uppercase; color: #666; font-weight: bold;">Consumo Mensal</span> 
                            <h2 style="margin: 5px 0; color: #003366; font-size: 22px;">${totalKwhMes.toFixed(2)} <span style="font-size: 14px;">kWh</span></h2> 
                        </div> 
                        <div style="display: table-cell; width: 33%; background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #27ae60;"> 
                            <span style="font-size: 11px; text-transform: uppercase; color: #666; font-weight: bold;">Custo Mensal Estimado</span> 
                            <h2 style="margin: 5px 0; color: #27ae60; font-size: 22px;">R$ ${totalCustoMes.toFixed(2).replace('.', ',')}</h2> 
                        </div> 
                        <div style="display: table-cell; width: 33%; background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #e67e22;"> 
                            <span style="font-size: 11px; text-transform: uppercase; color: #666; font-weight: bold;">Pegada de Carbono</span> 
                            <h2 style="margin: 5px 0; color: #e67e22; font-size: 22px;">${pegadaCarbonoCo2.toFixed(2)} <span style="font-size: 14px;">kg CO₂</span></h2> 
                        </div> 
                    </div> 

                    <div style="margin-bottom: 35px; background: #fff; padding: 15px; border: 1px solid #e2e8f0; border-radius: 10px;"> 
                        <h3 style="color: #003366; margin-top: 0; margin-bottom: 15px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Participação Temática no Consumo</h3> 
                        <div style="width: 280px; height: 280px; margin: 0 auto;"> 
                            <canvas id="pdf-chart-canvas"></canvas> 
                        </div> 
                    </div> 

                    <div style="margin-bottom: 25px; padding: 20px; border-radius: 8px; background-color: #fcfcfc; border: 1px solid #eee; border-left: 6px solid ${ecoCor};"> 
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;"> 
                            <h4 style="margin: 0; color: #003366; font-size: 15px;">📊 Impacto Econômico Financeiro</h4> 
                            <span style="background-color: ${ecoCor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase;">${ecoNivel}</span> 
                        </div> 
                        <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #444;">${ecoMensagem}</p> 
                    </div> 

                    <div style="margin-bottom: 35px; padding: 20px; border-radius: 8px; background-color: #fcfcfc; border: 1px solid #eee; border-left: 6px solid ${ecoLogCor};"> 
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;"> 
                            <h4 style="margin: 0; color: #003366; font-size: 15px;">🌱 Impacto Ecológico e Ambiental</h4> 
                            <span style="background-color: ${ecoLogCor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase;">${ecoLogNivel}</span> 
                        </div> 
                        <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #444;">${ecoLogMensagem}</p> 
                    </div> 

                    <div style="margin-bottom: 35px; padding: 20px; border-radius: 8px; background-color: #f8f9fa; border: 1px solid #e2e8f0;"> 
                        <h4 style="margin: 0 0 12px 0; color: #003366; font-size: 15px;">💡 Plano de Ação (10 Recomendações)</h4> 
                        <ol style="margin: 0; padding-left: 20px;"> ${listaDicasHtml} </ol> 
                    </div> 

                    <div style="page-break-before: auto;"> 
                        <h3 style="color: #003366; margin-top: 0; margin-bottom: 12px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Detalhamento por Equipamento</h3> 
                        <table style="width: 100%; border-collapse: collapse; font-size: 12px;"> 
                            <thead> 
                                <tr style="background-color: #003366; color: white;"> 
                                    <th style="padding: 10px; text-align: left; border-top-left-radius: 4px; border-bottom-left-radius: 4px;">Aparelho</th> 
                                    <th style="padding: 10px; text-align: center;">Tempo de Uso Estimado</th> 
                                    <th style="padding: 10px; text-align: center;">Consumo Mensal</th> 
                                    <th style="padding: 10px; text-align: right; border-top-right-radius: 4px; border-bottom-right-radius: 4px;">Valor Líquido (R$)</th> 
                                </tr> 
                            </thead> 
                            <tbody> 
                                ${tabelaLinhasHtml} 
                                <tr style="background-color: #f4f7f6; font-weight: bold; font-size: 13px;"> 
                                    <td colspan="2" style="padding: 12px; border-top: 2px solid #003366;">CUSTO TOTAL CALCULADO</td> 
                                    <td style="padding: 12px; border-top: 2px solid #003366; text-align: center; color: #003366;">${totalKwhMes.toFixed(2)} kWh</td> 
                                    <td style="padding: 12px; border-top: 2px solid #003366; text-align: right; color: #27ae60;">R$ ${totalCustoMes.toFixed(2).replace('.', ',')}</td> 
                                </tr> 
                            </tbody> 
                        </table> 
                    </div> 
                </div> 
            `; 

            templateHtml.style.display = "block"; 


            const ctx = document.getElementById('pdf-chart-canvas').getContext('2d'); 
            new Chart(ctx, { 
                type: 'doughnut', 
                data: { 
                    labels: window.aparelhosAdicionados.map(a => a.nome), 
                    datasets: [{ 
                        data: window.aparelhosAdicionados.map(a => a.consumoKwh), 
                        backgroundColor: [ 
                            '#27ae60', '#3498db', '#9b59b6', '#e67e22', '#e74c3c',  
                            '#1abc9c', '#f1c40f', '#34495e', '#bdc3c7', '#e84393' 
                        ] 
                    }] 
                }, 
                options: { 
                    responsive: false, 
                    maintainAspectRatio: false, 
                    animation: false, 
                    plugins: { 
                        legend: {  
                            position: 'bottom',  
                            labels: { boxWidth: 12, font: { size: 10 } }  
                        } 
                    } 
                } 
            }); 


            const opcoesPdf = { 
                margin:       10, 
                filename:     `Relatorio_EcoWatt_${new Date().toISOString().slice(0,10)}.pdf`, 
                image:        { type: 'jpeg', quality: 0.98 }, 
                html2canvas:  { scale: 2, useCORS: true, logging: false }, 
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' } 
            }; 

            setTimeout(() => { 
                html2pdf().set(opcoesPdf).from(templateHtml).save().then(() => {
                    relatorioPDFbotao.disabled = false;
                    relatorioPDFbotao.innerHTML = textoOriginal;
                }).catch(err => {
                    console.error("Erro ao gerar PDF:", err);
                    relatorioPDFbotao.disabled = false;
                    relatorioPDFbotao.innerHTML = textoOriginal;
                });
            }, 500); 
        }); 
    }
});