<div align="center">

# Especificação de Produto — react-forms

</div>

<div align="center">

[![Repositório no GitHub](https://img.shields.io/badge/Código%20Fonte-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/VictorMartinsD/react-forms)
[![Acessar Deploy](https://img.shields.io/badge/Acessar%20Deploy-GitHub%20Pages-blue?style=for-the-badge)](https://victormartinsd.github.io/react-forms/)
[![Notas de Estudo](https://img.shields.io/badge/Notas%20de%20Estudo-Documentação-0ea5e9?style=for-the-badge)](./study-notes.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://github.com/VictorMartinsD/react-forms/blob/main/LICENSE)

</div>

<a id="sumario"></a>

<div align="center">

## Sumário | Summary

| Português                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | English                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Visão Geral do Produto](#visao-geral-do-produto)<br>[Problema](#problema)<br>[Objetivo do Produto](#objetivo-do-produto)<br>[Usuário-Alvo](#usuario-alvo)<br>[Funcionalidades](#funcionalidades)<br>[Regras de Negócio](#regras-de-negocio)<br>[Fluxo do Usuário](#fluxo-do-usuario)<br>[MVP](#mvp)<br>[Decisões de Produto](#decisoes-de-produto)<br>[Limitações Atuais](#limitacoes-atuais)<br>[Próximos Passos](#proximos-passos)<br>[Métricas de Sucesso](#metricas-de-sucesso) | [Product Overview](#product-overview)<br>[Problem](#problem)<br>[Product Objective](#product-objective)<br>[Target User](#target-user)<br>[Features](#features)<br>[Business Rules](#business-rules)<br>[User Flow](#user-flow)<br>[MVP](#mvp-english)<br>[Product Decisions](#product-decisions)<br>[Current Limitations](#current-limitations)<br>[Next Steps](#next-steps)<br>[Success Metrics](#success-metrics) |

</div>

<a id="visao-geral-do-produto"></a>

## 1 — Visão Geral do Produto

O `react-forms` é um formulário para registrar os detalhes essenciais de um evento. O produto organiza, em uma única etapa, o nome, a data, o horário, o assunto principal e a descrição do encontro.

O sistema resolve a necessidade de reunir essas informações de forma estruturada antes da continuidade do planejamento. O usuário recebe orientação durante o preenchimento, impedimentos para combinações inválidas e confirmação quando o registro é concluído.

<a id="problema"></a>

## 2 — Problema

Planejar um evento exige definir informações básicas que podem ser esquecidas, preenchidas de forma incompleta ou combinadas com uma data e um horário indisponíveis.

Sem uma etapa organizada de registro, o usuário pode precisar revisar os dados repetidamente para descobrir campos vazios, descrições insuficientes ou horários incompatíveis. O produto concentra essa verificação no momento do preenchimento e reduz a chance de concluir um registro inconsistente.

<a id="objetivo-do-produto"></a>

## 3 — Objetivo do Produto

Permitir que o usuário registre os dados essenciais de um evento com clareza e receba uma confirmação de que o preenchimento foi concluído.

Ao utilizar o sistema, o usuário consegue:

- definir uma identificação para o evento;
- selecionar uma data futura e um horário disponível;
- classificar o assunto principal;
- informar um assunto personalizado quando necessário;
- registrar uma descrição dentro do limite esperado;
- retomar um preenchimento interrompido;
- corrigir os dados antes de concluir o registro.

<a id="usuario-alvo"></a>

## 4 — Usuário-Alvo

O produto é destinado a:

- estudantes e desenvolvedores que estejam organizando encontros ou atividades de tecnologia;
- pessoas responsáveis por estruturar os dados iniciais de um evento;
- usuários que precisam de um formulário guiado, mas não de um sistema completo de gestão de eventos.

O nível técnico exigido é baixo. O usuário precisa apenas saber informar os dados do evento e escolher as opções apresentadas. O contexto principal de uso é o planejamento inicial de um encontro, em computador ou dispositivo com navegador.

<a id="funcionalidades"></a>

## 5 — Funcionalidades

### Registro dos dados do evento

- O usuário informa o nome do evento.
- O sistema apresenta o limite de caracteres e impede que o nome ultrapasse 80 caracteres.
- O usuário escolhe a data e o horário.
- O usuário seleciona um assunto principal entre as opções disponíveis.
- O usuário informa uma descrição com entre 10 e 500 caracteres.
- O sistema apresenta contadores de caracteres para o nome e a descrição.

### Seleção de assunto personalizado

- O usuário seleciona a opção `Outro`.
- O sistema apresenta um campo adicional para especificar o assunto.
- O usuário informa o assunto personalizado dentro do limite de 15 caracteres.

### Disponibilidade de data e horário

- O sistema aceita datas a partir do dia seguinte.
- O usuário escolhe um horário de acordo com a data selecionada.
- O sistema apresenta horários diferentes para dias úteis e sábados.
- O sistema não oferece horários aos domingos.

### Validação e correção

- O usuário tenta avançar sem preencher um campo obrigatório.
- O sistema informa qual dado precisa ser corrigido.
- O sistema mantém os dados válidos já informados para evitar retrabalho.

### Recuperação de preenchimento

- O usuário preenche parte do formulário e deixa a página.
- O sistema mantém o rascunho disponível quando o usuário retorna.
- O usuário pode continuar o preenchimento a partir dos dados anteriores.

### Conclusão do registro

- O usuário envia um formulário válido.
- O sistema confirma que o evento foi salvo.
- O sistema limpa o formulário para permitir um novo registro.

<a id="regras-de-negocio"></a>

## 6 — Regras de Negócio

- O nome do evento é obrigatório.
- O nome do evento deve ter no máximo 80 caracteres.
- A data do evento é obrigatória.
- A data escolhida deve ser posterior ao dia atual.
- Domingos não estão disponíveis para eventos.
- O horário é obrigatório.
- O horário deve pertencer à faixa disponível para a data selecionada.
- Dias úteis disponibilizam horários das 8h às 18h.
- Sábados disponibilizam horários das 9h às 13h.
- O assunto principal é obrigatório.
- Quando o assunto principal for `Outro`, a especificação adicional será obrigatória.
- O assunto personalizado deve ter no máximo 15 caracteres.
- A descrição é obrigatória.
- A descrição deve ter entre 10 e 500 caracteres.
- O envio só é concluído quando todos os dados obrigatórios forem válidos.
- Ao alterar a data, o horário escolhido anteriormente deixa de ser considerado válido e precisa ser selecionado novamente.
- Ao selecionar um domingo, o sistema mantém a data anterior e informa que a data não está disponível.
- Um preenchimento não concluído pode ser retomado posteriormente.
- Depois de um envio válido, o rascunho anterior é removido e o formulário volta ao estado inicial.

<a id="fluxo-do-usuario"></a>

## 7 — Fluxo do Usuário

1. O usuário acessa o formulário de detalhes do evento.
2. O sistema apresenta os campos necessários e informa que todos são obrigatórios.
3. O usuário informa o nome do evento.
4. O usuário escolhe uma data a partir do dia seguinte.
5. O sistema apresenta os horários compatíveis com a data escolhida.
6. O usuário seleciona um horário disponível.
7. O usuário escolhe o assunto principal.
8. Se escolher `Outro`, o usuário informa o assunto personalizado.
9. O usuário escreve a descrição do evento.
10. O sistema sinaliza qualquer informação ausente ou inválida.
11. O usuário corrige os campos indicados, se necessário.
12. O usuário envia o formulário quando todos os dados estão válidos.
13. O sistema confirma o salvamento e limpa os dados do preenchimento concluído.

<a id="mvp"></a>

## 8 — MVP (Minimum Viable Product)

O núcleo indispensável do produto é o registro validado dos dados essenciais de um evento:

- nome;
- data;
- horário disponível;
- assunto;
- descrição;
- confirmação de conclusão.

Sem o formulário validado e sem a confirmação do registro, o produto não cumpre sua finalidade principal. A recuperação de rascunho e o assunto personalizado ampliam a utilidade, mas são complementares ao núcleo de preenchimento e envio.

<a id="decisoes-de-produto"></a>

## 9 — Decisões de Produto

### Exigir uma data futura

Eventos não podem ser agendados para o dia atual ou para uma data passada. Essa regra evita registros que já não podem ser planejados adequadamente.

### Bloquear domingos

O domingo é tratado como um dia indisponível. A restrição evita que o usuário avance com uma data para a qual não existem horários de atendimento ou planejamento definidos.

### Oferecer horários conforme a data

O usuário não precisa interpretar uma lista geral de horários. O sistema mostra apenas as opções compatíveis com o dia selecionado, reduzindo escolhas inválidas.

### Tornar o assunto personalizado condicional

O campo adicional só aparece quando necessário. Essa decisão mantém o formulário curto para a maioria dos casos sem impedir o registro de temas fora da lista principal.

### Mostrar limites durante o preenchimento

Os contadores de caracteres tornam os limites visíveis antes do envio. Isso reduz correções posteriores e ajuda o usuário a ajustar o conteúdo no momento em que escreve.

### Preservar rascunhos

O preenchimento pode ser interrompido sem que o usuário precise recomeçar. Essa decisão reduz o custo de uma saída acidental ou de uma pausa durante o planejamento.

### Confirmar e limpar após o envio

O feedback de sucesso informa que a ação foi concluída, enquanto a limpeza evita que um evento já registrado seja confundido com um novo rascunho.

<a id="limitacoes-atuais"></a>

## 10 — Limitações Atuais

- O produto registra apenas um fluxo de preenchimento por vez.
- Não há autenticação ou contas de usuário.
- Não há colaboração entre participantes ou organizadores.
- Não há edição, consulta ou histórico de eventos já registrados.
- Não há integração com calendário, e-mail ou serviço externo.
- O envio não apresenta uma etapa posterior de gerenciamento do evento.
- Não há confirmação por e-mail ou outro canal fora da própria interface.
- A confirmação atual representa a conclusão do preenchimento, não uma publicação ou reserva externa.

<a id="proximos-passos"></a>

## 11 — Próximos Passos (Roadmap)

- Permitir consultar e editar eventos já registrados.
- Adicionar histórico de eventos e seus respectivos estados.
- Incluir autenticação para associar registros a um usuário.
- Permitir colaboração entre organizadores.
- Integrar o evento a calendários externos.
- Enviar confirmação e lembretes por e-mail.
- Adicionar etapas para local, participantes e divulgação.
- Permitir configurar diferentes faixas de disponibilidade.

<a id="metricas-de-sucesso"></a>

## 12 — Métricas de Sucesso

O sucesso do produto pode ser avaliado por comportamentos observáveis do usuário:

- proporção de usuários que concluem o preenchimento sem abandonar o fluxo;
- proporção de formulários enviados com sucesso;
- redução de tentativas de envio com campos inválidos;
- tempo necessário para completar o registro dos dados essenciais;
- quantidade média de correções antes do envio;
- frequência com que usuários retomam um rascunho e concluem o preenchimento;
- ocorrência de escolhas incompatíveis de data e horário após a orientação apresentada;
- proporção de usuários que conseguem concluir o fluxo sem assistência.

---

Documento de produto elaborado por [Victor Martins](https://github.com/VictorMartinsD).

Este documento descreve a visão funcional e estratégica do sistema.

---

<div align="center">

# Product Specification — react-forms

</div>

<a id="product-overview"></a>

## 1 — Product Overview

`react-forms` is a form for recording the essential details of an event. The product gathers the event name, date, time, main subject, and description in a single step.

The system addresses the need to organize this information before planning continues. The user receives guidance while filling out the form, is prevented from submitting invalid combinations, and receives confirmation when the registration is completed.

<a id="problem"></a>

## 2 — Problem

Planning an event requires defining basic information that can be forgotten, left incomplete, or combined with an unavailable date and time.

Without an organized registration step, the user may need to review the information repeatedly to find empty fields, insufficient descriptions, or incompatible times. The product centralizes these checks during entry and reduces the chance of completing an inconsistent registration.

<a id="product-objective"></a>

## 3 — Product Objective

Enable the user to record the essential event details clearly and receive confirmation that the form has been completed.

By using the system, the user can:

- define an identity for the event;
- select a future date and an available time;
- classify the main subject;
- provide a custom subject when needed;
- record a description within the expected limit;
- resume an interrupted form;
- correct the information before completing the registration.

<a id="target-user"></a>

## 4 — Target User

The product is intended for:

- students and developers organizing technology meetups or activities;
- people responsible for structuring the initial details of an event;
- users who need a guided form, but not a complete event management system.

The required technical level is low. The user only needs to provide event details and choose from the available options. The primary context is the initial planning of a meetup, using a computer or a browser-enabled device.

<a id="features"></a>

## 5 — Features

### Event detail registration

- The user enters the event name.
- The system displays the character limit and prevents the name from exceeding 80 characters.
- The user selects the date and time.
- The user selects a main subject from the available options.
- The user enters a description between 10 and 500 characters.
- The system displays character counters for the name and description.

### Custom subject selection

- The user selects `Other`.
- The system displays an additional field for specifying the subject.
- The user enters the custom subject within the 15-character limit.

### Date and time availability

- The system accepts dates starting from the following day.
- The user selects a time according to the chosen date.
- The system displays different time ranges for weekdays and Saturdays.
- The system does not offer times on Sundays.

### Validation and correction

- The user attempts to continue without completing a required field.
- The system identifies the information that needs correction.
- The system preserves valid information already entered to avoid rework.

### Form recovery

- The user fills out part of the form and leaves the page.
- The system keeps the draft available when the user returns.
- The user can continue from the previously entered information.

### Registration completion

- The user submits a valid form.
- The system confirms that the event was saved.
- The system clears the form so a new registration can be started.

<a id="business-rules"></a>

## 6 — Business Rules

- The event name is required.
- The event name must be no longer than 80 characters.
- The event date is required.
- The selected date must be after the current day.
- Sundays are unavailable for events.
- A time is required.
- The time must belong to the range available for the selected date.
- Weekdays offer times from 8:00 a.m. to 6:00 p.m.
- Saturdays offer times from 9:00 a.m. to 1:00 p.m.
- A main subject is required.
- When the main subject is `Other`, the additional subject is required.
- The custom subject must be no longer than 15 characters.
- A description is required.
- The description must contain between 10 and 500 characters.
- Submission is completed only when all required information is valid.
- When the date changes, the previously selected time is no longer considered valid and must be selected again.
- When a Sunday is selected, the system keeps the previous date and explains that the date is unavailable.
- An incomplete form can be resumed later.
- After a valid submission, the previous draft is removed and the form returns to its initial state.

<a id="user-flow"></a>

## 7 — User Flow

1. The user opens the event details form.
2. The system displays the required fields and states that all fields are mandatory.
3. The user enters the event name.
4. The user selects a date starting from the following day.
5. The system displays the times compatible with the selected date.
6. The user selects an available time.
7. The user selects the main subject.
8. If `Other` is selected, the user enters the custom subject.
9. The user writes the event description.
10. The system identifies any missing or invalid information.
11. The user corrects the indicated fields when necessary.
12. The user submits the form once all information is valid.
13. The system confirms the save and clears the completed registration data.

<a id="mvp-english"></a>

## 8 — MVP (Minimum Viable Product)

The essential product core is the validated registration of the event's basic details:

- name;
- date;
- available time;
- subject;
- description;
- completion confirmation.

Without the validated form and confirmation of registration, the product does not fulfill its primary purpose. Draft recovery and custom subjects increase its usefulness, but they complement the core entry and submission flow.

<a id="product-decisions"></a>

## 9 — Product Decisions

### Require a future date

Events cannot be scheduled for the current day or a past date. This rule prevents registrations that can no longer be planned appropriately.

### Block Sundays

Sunday is treated as an unavailable day. This restriction prevents the user from proceeding with a date for which no defined planning or service times exist.

### Offer times according to the date

The user does not need to interpret a general list of times. The system shows only the options compatible with the selected day, reducing invalid choices.

### Make the custom subject conditional

The additional field appears only when necessary. This keeps the form short for most cases without preventing subjects outside the main list from being registered.

### Show limits while filling out the form

Character counters make the limits visible before submission. This reduces later corrections and helps the user adjust the content while writing.

### Preserve drafts

The form can be interrupted without requiring the user to start over. This reduces the cost of an accidental exit or a pause during planning.

### Confirm and clear after submission

Success feedback tells the user that the action is complete, while clearing the form prevents a registered event from being mistaken for a new draft.

<a id="current-limitations"></a>

## 10 — Current Limitations

- The product supports only one form flow at a time.
- There is no authentication or user account.
- There is no collaboration between participants or organizers.
- There is no editing, viewing, or history of previously registered events.
- There is no calendar, email, or external service integration.
- Submission does not lead to a subsequent event management stage.
- There is no confirmation by email or another channel outside the interface.
- The current confirmation represents completion of the form, not external publication or reservation.

<a id="next-steps"></a>

## 11 — Next Steps (Roadmap)

- Allow users to view and edit registered events.
- Add event history and event statuses.
- Add authentication to associate registrations with a user.
- Enable collaboration between organizers.
- Integrate events with external calendars.
- Send confirmation and reminder emails.
- Add stages for location, attendees, and promotion.
- Allow different availability ranges to be configured.

<a id="success-metrics"></a>

## 12 — Success Metrics

Product success can be assessed through observable user behavior:

- proportion of users who complete the form without abandoning the flow;
- proportion of forms submitted successfully;
- reduction in submission attempts with invalid fields;
- time required to complete the essential event details;
- average number of corrections before submission;
- frequency with which users resume a draft and complete the form;
- occurrence of incompatible date and time choices after the provided guidance;
- proportion of users who complete the flow without assistance.

---

Product document prepared by [Victor Martins](https://github.com/VictorMartinsD).

This document describes the functional and strategic vision of the system.
