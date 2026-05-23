# MEMORY.md — Romanos Match Center

## Contexto do Projeto

**App:** Romanos Match Center  
**Time:** Romanos FC  
**Liga:** Série Prata 2026 — Liga BC · Grupo A  
**URL oficial:** https://ligascfutebol7.com.br/campeonatos/11134-serie-prata-2026  
**Workspace:** c:\Users\netos\Desktop\Romanos

---

## Stack Técnica

- **Frontend:** HTML + CSS (Vanilla) + JavaScript ES6 Modules
- **Storage:** localStorage (key: `romanos_data_v3`)
- **Servidor dev:** `npx serve` na porta 3456
- **Fontes:** Inter + Cinzel (Google Fonts)
- **Cores:** Dark mode vinho/dourado (identidade Romanos FC)

---

## Novas Decisões de Arquitetura e Fluxos

1. **Spot-Based Lineup (Escalação Estável)**: 
   - A prancheta agora mapeia jogadores a 7 spots físicos correspondentes à formação selecionada.
   - O usuário pode clicar diretamente em qualquer "bolinha" no campo para alterar ou remover o jogador escalado ali por meio de um menu de seleção.

2. **Múltiplas Fases Táticas (Multi-phase Coordinates)**:
   - Para cada jogo, as coordenadas dos jogadores são salvas de forma independente por fase tática: `Esquema Inicial`, `Fase Defensiva`, `Fase Ofensiva`, `Escanteio Favor` e `Pressionando Saída`.

3. **Prancheta Estilo Apple Notes (Markup Toolbar)**:
   - Implementada barra flutuante inspirada no iOS Markup com ícones SVG modernos e limpos.
   - Modos Unificados:
     - 🖐️ **Mover**: Arrasta jogadores e bola `⚽`.
     - ✏️ **Rabiscar**: Desenho livre de linhas brancas na tela.
     - ── **Passe**: Desenha setas sólidas amarelas/douradas (`#F1C40F`) a partir de qualquer ponto do campo.
     - - - **Corrida**: Desenha setas tracejadas vermelhas (`#E74C3C`) a partir de qualquer ponto do campo.
     - 🔄 **Resetar**: Botão para restaurar as posições padrão dos jogadores e bola da fase ativa de acordo com a formação selecionada.
     - 🧹 **Limpar**: Remove desenhos da fase ativa.

4. **Arrasto Inteligente e Híbrido**:
   - Os pinos dos jogadores e a bola interceptam cliques/arrastes com `stopPropagation()` em todos os modos. Isso permite mover qualquer peça a qualquer momento, mesmo quando os modos de desenho (Passe/Corrida/Rabiscar) estiverem ativos, sem desenhar riscos indesejados no fundo.

5. **Templates do FUT7 Cadastrados**:
   - `3-2-1` (Padrão: 1 fixo, 2 alas, 2 meias, 1 pivô)
   - `2-3-1` (Ofensivo: 2 defensores, 3 meias, 1 pivô)
   - `3-1-2` (Duplo Pivô: 3 defensores, 1 meia, 2 atacantes)
   - `2-2-2` (Quadrante: 2 defensores, 2 alas, 2 atacantes)

6. **Peça da Bola (⚽)**:
   - Adicionada uma peça da bola arrastável (`⚽`) com coordenadas persistentes e salvas independentemente por fase tática (`activeCoords['ball']`).

7. **🕵️ Dossiê Espião (Análise de Rival)**:
   - Integrado diretamente na prancheta tática abaixo do campo de futebol.
   - Permite preencher o esquema tático provável do rival.
   - Permite adicionar e remover pontos fortes (💪) e fraquezas (⚠️) do adversário de forma dinâmica por jogo.

---

## Status do Projeto

- [x] Fase 1: Foundation (design system, layout, navegação)
- [x] Fase 2: Calendário + próximo jogo
- [x] Fase 3: Escalação Visual (campo + seleção + formações)
- [x] Fase 4: Súmula Pós-jogo (gols, assists, cartões, modal)
- [x] Fase 5: Estatísticas (individual + time + suspensos)
- [x] Fase 6: Tabela + H2H + Ranking
- [x] Fase 7: Elenco por posição + comissão técnica na sidebar
- [x] Fase 8: Prancheta tática com arrasto por fase, substituição ao clicar na bolinha, adição de novos jogadores e avaliação de jogadas na súmula.
- [x] Fase 9: Suporte a rabiscos no campo e criação de rotas com setas a partir das peças dos jogadores.
- [x] Fase 10: Integração do painel "Dossiê Espião" na prancheta para monitorar pontos fortes e fracos do rival durante o planejamento tático.
- [x] Fase 11: Correção de responsividade mobile na prancheta e fluxo vertical para visualização perfeita em celulares.
- [x] Fase 12: Remoção da lista de elenco redundante na tela de escalação.
- [x] Fase 13: Adicionada bola de futebol (⚽) arrastável e controle de tipos de linha (sólida para Passe/Chute e tracejada para Corrida).
- [x] Fase 14: Barra de marcação estilo Apple (iOS Markup) integrada com ferramentas unificadas e ícones limpos em SVG.
- [x] Fase 15: Desenho livre de setas (passe/corrida) em qualquer ponto do campo, botão de reset de posições e templates de FUT7 atualizados (incluindo 2-2-2).
- [x] Fase 16: Interação inteligente híbrida. Arrastar peças sempre move a peça sem gerar rabiscos acidentais no fundo.
- [x] Fase 17: Cores de setas individualizadas (amarelo para passe, vermelho para corrida, branco para rabiscar). Correção do bug de arrasto de jogadores no modo desenho e ajuste no reset de posições padrão.
- [x] Fase 18: Inicialização do Git e publicação do projeto no repositório remoto do GitHub.
- [x] Fase 19: Migração do banco de dados (de localStorage para Supabase remoto) com inicialização de dados automática na primeira carga.

