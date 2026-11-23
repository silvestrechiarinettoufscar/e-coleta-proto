# E-Coleta

Protótipo do pacote 3 de Interação Humano-Computador. As telas e os fluxos seguem o Figma do grupo.

O projeto usa páginas HTML, CSS e JavaScript, com Vite. Node e npm cuidam da instalação, do servidor local e da geração da versão para publicação.

## Como abrir

Instale o [Node.js](https://nodejs.org/) caso ainda não tenha. Recomendamos a versão 24; o projeto aceita a partir da 22.12.

Extraia o ZIP, abra a pasta `e-coleta` no VS Code e execute no terminal dessa pasta:

```bash
npm install
npm run dev
```

Abra o endereço exibido no terminal, normalmente **http://localhost:5173**. Na primeira vez, a instalação precisa de internet. Depois, basta executar `npm run dev`.

Para visualizar como celular, abra as ferramentas do navegador com `F12` e ative o modo de dispositivo com `Ctrl+Shift+M`. Use uma largura de 360 ou 390 pixels. Para encerrar o servidor, pressione `Ctrl+C` no terminal.

Se estiver usando a pasta da disciplina, entre em `pacote-3` antes de executar os comandos.

## Comandos

| Comando | Uso |
| --- | --- |
| `npm run dev` | Abrir o servidor de desenvolvimento. |
| `npm run build` | Gerar os arquivos do site em `dist/`. |
| `npm run preview` | Conferir localmente a versão gerada em `dist/`. |
| `npm test` | Verificar as regras de busca, pesos, validação e armazenamento. |

Para testar em um celular na mesma rede, use `npm run dev -- --host 0.0.0.0`. Abra no celular o endereço de rede mostrado pelo Vite. O computador precisa permitir essa conexão no firewall.

## Fluxos

No descarte, selecione os materiais, busque os pontos próximos e consulte o endereço, os horários e a rota a pé. O campo Localização segue o Figma. A busca manual usa os pontos e as distâncias do cenário de exemplo; o texto digitado não é convertido em coordenadas. O botão de localização continua usando a posição autorizada no aparelho.

Na coleta, abra o agendamento de Beatriz, confirme, consulte a rota e registre a faixa de peso. O botão de foto permite selecionar uma imagem ou usar a câmera, conforme o aparelho. A conclusão mostra o registro no histórico do dia. No itinerário, a coleta fica marcada como concluída e abre esse registro.

Na triagem, abra o lote EC-024, confira o material e inicie a triagem. O formulário começa com os valores mostrados no Figma. Use o campo Categoria para consultar e editar notebook, celular e cabos. Ao mudar de categoria, os valores preenchidos são guardados. "Salvar e revisar lote" abre a revisão, com o total calculado a partir dos pesos. "Editar categorias" retorna ao formulário.

A tela de acessibilidade permite ativar alto contraste e texto ampliado. As escolhas são mantidas nas outras páginas e ao reabrir o navegador. O exemplo de texto ampliado do Figma continua disponível. Leitura em voz alta e ditado no formulário de triagem dependem do suporte e das permissões do navegador.

## Organização do código

O site tem 18 páginas HTML. O conteúdo, os campos e os links estão escritos nesses arquivos. Para alterar um texto ou a estrutura de uma tela, edite o HTML correspondente em `pages/`.

```text
index.html                  Menu dos fluxos
pages/
  descarte/                 Início, materiais, pontos, detalhes e rota
  coleta/                   Itinerário, agendamento, rota, registro e conclusão
  triagem/                  Lotes, conferência, formulário, revisão e conclusão
  acessibilidade/           Recursos e exemplo de texto ampliado
src/
  pages/                    JavaScript das interações de cada fluxo
  main.js                   Comportamento comum às páginas
  styles.css                Estilos compartilhados
  acoes.js                  Localização, GPS e recursos de voz
  interface.js              Formatação de textos e mensagens de erro
  estado.js                 Dados em uso e rascunhos
  armazenamento.js          Leitura e gravação no navegador
  regras.js                 Validação, pesos e busca de pontos
  dados.js                  Exemplos iniciais
public/
  fonts/                    Fonte Inter e licença
  images/                   Mapa esquemático e ícone do site
tests/                      Testes das regras
```

A navegação usa links entre páginas e parâmetros na URL para identificar um ponto, uma coleta ou um lote. Por exemplo, `pages/coleta/agendamento.html?id=C-001` abre a coleta de Beatriz. O JavaScript preenche os dados variáveis e responde às ações dos formulários.

`vite.config.js` lista as páginas que entram na versão de publicação. Essa é a configuração de [múltiplas páginas do Vite](https://vite.dev/guide/build.html#multi-page-app). `.editorconfig` e `.prettierrc.json` registram o padrão de formatação do projeto.

## Dados do protótipo

Os pontos, endereços e registros são exemplos do projeto. Os mapas são esquemáticos. "Abrir GPS" abre o endereço de exemplo no Google Maps. Não há envio de avisos para doadores nem acesso de gerente implementado.

Os registros e fotos ficam no armazenamento local de cada navegador, sem banco de dados compartilhado. Para restaurar os exemplos durante o desenvolvimento, remova a chave `e-coleta-pacote3-v1` do armazenamento local nas ferramentas do navegador.

A barra de horário e bateria do Figma pertence ao aparelho e não foi reproduzida. Algumas telas podem ter rolagem para acomodar os campos do navegador.
