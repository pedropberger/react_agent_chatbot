Product Requirements Document (PRD) - Chatbot Interface com Histórico

1. Visão Geral

Este projeto desenvolve uma interface web para um agente de IA que opera via API, permitindo aos usuários enviar prompts, visualizar respostas, acessar o histórico de chats e interagir com as respostas (copiar e avaliar). A interface será construída usando Streamlit para simplicidade e integração com o backend Python existente.

1.1 Objetivo

Criar uma interface amigável que:





Permita enviar prompts para a API do agente de IA.



Exiba o histórico de chats na barra lateral.



Ofereça opções para copiar respostas e avaliá-las (ex.: positivo/negativo).



Seja fácil de usar e manter, aproveitando o ecossistema Python.

1.2 Público-Alvo





Usuários que interagem com o agente de IA para obter respostas a perguntas variadas.



Desenvolvedores que desejam testar e iterar sobre o agente de IA.

2. Requisitos Funcionais

2.1 Envio de Prompts





Descrição: O usuário insere um prompt em um campo de texto na interface principal.



Funcionalidade:





Campo de texto para entrada do prompt.



Botão "Enviar" para submeter o prompt à API (POST /localhost:1234 com payload {pergunta: "texto do prompt"}).



Exibição da resposta retornada pela API ({resposta: "texto da resposta"}) na área principal.

2.2 Histórico de Chats





Descrição: O histórico de interações (prompts e respostas) é salvo e exibido na barra lateral.



Funcionalidade:





Exibir uma lista de chats anteriores com visualização de prompt e trecho inicial da resposta.



Permitir clicar em um chat para visualizar o prompt e a resposta completa na área principal.



Armazenar o histórico em uma estrutura local (ex.: lista em memória ou arquivo JSON).

2.3 Interação com Respostas





Descrição: O usuário pode interagir com as respostas da IA.



Funcionalidade:





Botão "Copiar" para copiar a resposta para a área de transferência.



Botão de avaliação (ex.: polegares para cima/baixo) para marcar a qualidade da resposta.



Exibir o status de avaliação no histórico (ex.: ícone de positivo/negativo).

2.4 Interface de Usuário





Descrição: Interface limpa e funcional usando Streamlit.



Funcionalidade:





Barra lateral para histórico de chats.



Área principal com campo de texto para prompt, botão de envio e exibição da resposta.



Design responsivo e intuitivo, com feedback visual para ações (ex.: confirmação de cópia).

3. Requisitos Não-Funcionais





Desempenho: A interface deve carregar rapidamente e processar respostas da API em menos de 2 segundos (dependendo da API).



Escalabilidade: Suportar múltiplos chats sem impacto significativo no desempenho (armazenamento em memória para protótipo inicial).



Segurança: Proteger contra injeção de código no campo de prompt.



Compatibilidade: Funcionar em navegadores modernos (Chrome, Firefox) via Streamlit.

4. Escopo





Dentro do Escopo:





Interface web com Streamlit.



Integração com API existente em localhost:1234.



Histórico de chats local.



Funcionalidades de copiar e avaliar respostas.



Fora do Escopo:





Autenticação de usuários.



Armazenamento persistente em banco de dados.



Suporte a múltiplos usuários simultâneos.



Customização avançada da UI.

5. Fluxo de Trabalho





O usuário acessa a interface Streamlit.



Insere um prompt no campo de texto e clica em "Enviar".



A interface envia o prompt à API e exibe a resposta na área principal.



O prompt e a resposta são salvos no histórico, exibido na barra lateral.



O usuário pode:





Clicar em um chat no histórico para revisá-lo.



Copiar a resposta para a área de transferência.



Avaliar a resposta (positivo/negativo).

6. Riscos





Risco: A API pode estar indisponível ou responder lentamente.





Mitigação: Exibir mensagem de erro clara e permitir nova tentativa.



Risco: Histórico extenso pode impactar desempenho.





Mitigação: Limitar o número de chats exibidos (ex.: últimos 50).

7. Cronograma Estimado





Semana 1: Configuração do ambiente Streamlit e integração com API.



Semana 2: Implementação do histórico de chats e funcionalidades de copiar/avaliar.



Semana 3: Testes, ajustes de UI e documentação.

8. Critérios de Sucesso





Interface funcional com envio de prompts e exibição de respostas.



Histórico de chats acessível na barra lateral.



Funcionalidades de copiar e avaliar respostas operacionais.



Feedback positivo de usuários iniciais sobre usabilidade.