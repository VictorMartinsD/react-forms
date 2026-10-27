<div align="center">

# Notas de Estudo — react-forms

[![Repositório no GitHub](https://img.shields.io/badge/Código%20Fonte-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/VictorMartinsD/react-forms)
[![Acessar Deploy](https://img.shields.io/badge/Acessar%20Deploy-GitHub%20Pages-blue?style=for-the-badge)](https://victormartinsd.github.io/react-forms/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://github.com/VictorMartinsD/react-forms/blob/main/LICENSE)

</div>

<a id="sumario"></a>

<div align="center">

## Sumário | Summary

| Português                                                                                                                                                                                                                                                                                                                                                                      | English                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Visão Geral Técnica](#visao-geral-tecnica)<br>[Guia de Implementação](#guia-de-implementacao)<br>[Conceitos e Tecnologias](#conceitos-e-tecnologias)<br>[Decisões Técnicas](#decisoes-tecnicas)<br>[Problemas Resolvidos](#problemas-resolvidos)<br>[Boas Práticas](#boas-praticas)<br>[Aprendizados Técnicos](#aprendizados-tecnicos)<br>[Próximos Passos](#proximos-passos) | [Technical Overview](#technical-overview)<br>[Implementation Guide](#implementation-guide)<br>[Concepts and Technologies](#concepts-and-technologies)<br>[Technical Decisions](#technical-decisions)<br>[Resolved Issues](#resolved-issues)<br>[Best Practices](#best-practices)<br>[Technical Learnings](#technical-learnings)<br>[Next Steps](#next-steps-english) |

</div>

<a id="visao-geral-tecnica"></a>

## 📌 Visão Geral Técnica

O projeto é uma aplicação React escrita em TypeScript e empacotada pelo Vite. A implementação concentra o fluxo do formulário em [App.tsx](../src/App.tsx), enquanto o estado persistido foi isolado em [event-form-store.ts](../src/store/event-form-store.ts). Essa separação mantém a definição de dados e as operações de armazenamento fora da camada de apresentação.

A estrutura principal é:

- `src/main.tsx`: valida a existência do elemento `#root`, inicializa o React e habilita `StrictMode`.
- `src/App.tsx`: configura o formulário, as regras de validação, os campos condicionais e o fluxo de submissão.
- `src/store/event-form-store.ts`: define `EventFormData`, os valores iniciais e uma store Zustand persistida.
- `src/App.css` e `src/global.css`: separam estilos específicos da tela das regras globais de reset, tipografia e acessibilidade visual.
- `vite.config.ts`: configura o plugin React, o caminho-base relativo e o alias `@` para `src`.

O resultado é uma arquitetura pequena e direta, adequada para estudar o ciclo completo de um formulário tipado: entrada, validação, persistência temporária, submissão e limpeza.

<a id="guia-de-implementacao"></a>

## 🧭 Guia de Implementação

### 1. Modelagem dos dados

O tipo `EventFormData` funciona como contrato compartilhado entre o formulário e a store. Campos como `name`, `date`, `time`, `subject` e `description` são obrigatórios no modelo; `otherSubject` é opcional porque só participa do fluxo quando o assunto selecionado é `other`.

`initialFormData` centraliza os valores vazios usados tanto na inicialização quanto na limpeza após o envio. Isso evita duplicar objetos literais com formatos potencialmente diferentes.

### 2. Integração do React Hook Form

O `useForm<EventFormData>` recebe os dados persistidos como `defaultValues` e integra o `yupResolver(schema)`. Os campos são conectados por `Controller`, uma escolha útil para manter uma interface uniforme com componentes nativos e permitir customizações no `onChange`.

O estado observado por `useWatch` alimenta:

1. contadores de caracteres;
2. opções de horário disponíveis;
3. exibição condicional do campo `otherSubject`;
4. persistência incremental do formulário.

### 3. Regras dependentes da data

As funções `getDateString`, `isSunday` e `getAvailableTimes` isolam regras de calendário. A data mínima é o dia seguinte; domingos não são aceitos; dias úteis e sábados produzem faixas de horário diferentes.

Quando a data muda, o horário selecionado é limpo com `setValue("time", "")`. Assim, uma opção válida para a data anterior não permanece associada à nova data.

### 4. Persistência e submissão

`persist` e `createJSONStorage` salvam `formData` em `localStorage` com a chave `event-form-storage`. Um `useEffect` acompanha os valores do formulário e chama `saveFormData` para mesclar alterações parciais.

Na submissão válida, `onSubmit`:

1. limpa a store;
2. remove o armazenamento persistido;
3. restaura `initialFormData`;
4. exibe o feedback de sucesso;
5. registra os dados enviados no console para inspeção durante o estudo.

### 5. Execução e qualidade

Os scripts em [package.json](../package.json) cobrem desenvolvimento (`vite`), build (`tsc -b && vite build`), ESLint, Prettier e uma verificação combinada. O hook [`.husky/pre-commit`](../.husky/pre-commit) executa `lint-staged`, aplicando lint e formatação somente aos arquivos modificados.

<a id="conceitos-e-tecnologias"></a>

## 🧠 Conceitos e Tecnologias

- **React 19**: composição da interface e gerenciamento do ciclo de vida com `useState`, `useEffect` e `StrictMode`.
- **TypeScript**: tipagem do payload do formulário, da store Zustand e dos parâmetros das funções de calendário.
- **React Hook Form**: gerenciamento de campos, submissão e estado de erros sem criar um estado React independente para cada input.
- **Yup**: schema declarativo com validações simples, testes customizados e regra condicional com `when`.
- **`@hookform/resolvers`**: adaptação do schema Yup ao ciclo de validação do React Hook Form.
- **Zustand**: store mínima com `saveFormData` e `clearFormData`.
- **`localStorage`**: persistência no navegador por meio do middleware `persist`.
- **Vite**: servidor de desenvolvimento, build de produção, plugin React e configuração do `base` relativo.
- **ESLint, Prettier e lint-staged**: consistência de código e validação automatizada antes do commit.
- **CSS responsivo**: grid, media queries, estados de foco e suporte a `prefers-reduced-motion`.

<a id="decisoes-tecnicas"></a>

## ⚙️ Decisões Técnicas

### Schema como fonte das regras de dados

As restrições de tamanho, obrigatoriedade, data mínima, domingo indisponível e horário válido ficam no `schema`. Isso mantém a validação de submissão centralizada, enquanto algumas regras de interação são antecipadas no componente para melhorar o feedback.

### Regras de horário derivadas da data

Os horários não são armazenados como uma lista fixa. `getAvailableTimes` deriva as opções a partir da data selecionada, reduzindo estado duplicado e garantindo que o schema valide a mesma regra usada na interface.

### Persistência parcial mesclada

`saveFormData` recebe `Partial<EventFormData>` e mescla o fragmento com o estado atual. Essa decisão permite persistir cada alteração observada sem exigir que todos os campos sejam reconstruídos a cada evento.

### CSS separado por responsabilidade

`global.css` contém normalização e regras gerais; `App.css` contém o layout e os componentes visuais da tela. Variáveis CSS concentram as cores e facilitam a manutenção do tema.

### Build adequado ao GitHub Pages

O `base: "./"` no Vite permite que os assets sejam resolvidos de forma relativa quando o build é servido em um caminho de projeto do GitHub Pages, em vez de depender da raiz do domínio.

<a id="problemas-resolvidos"></a>

## 🧩 Problemas Resolvidos

- **Horário incompatível com a data**: a troca de data limpa o horário anterior e recalcula as opções disponíveis.
- **Domingos selecionados pelo input nativo**: o `onChange` intercepta o valor, restaura o valor anterior e registra um erro explícito.
- **Campo condicional inconsistente**: `otherSubject` só é renderizado quando `subject === "other"` e também se torna obrigatório no Yup nesse mesmo caso.
- **Dados perdidos durante o preenchimento**: `useWatch` combinado com Zustand e `localStorage` permite recuperar o rascunho após uma nova abertura da página.
- **Estado persistido após envio**: o fluxo válido limpa tanto a store em memória quanto o armazenamento persistido.
- **Feedback pouco acessível**: mensagens de erro usam `aria-invalid` e `aria-describedby`; o sucesso usa `aria-live="polite"` e `role="status"`.
- **Layout em telas menores**: media queries reorganizam as colunas, campos de assunto e data/horário para uma única coluna.

<a id="boas-praticas"></a>

## 🛠️ Boas Práticas

1. Manter o tipo `EventFormData` compartilhado entre schema, formulário e store.
2. Reutilizar `initialFormData` para inicialização e reset.
3. Usar `maxLength` nos elementos e limites equivalentes no schema, fornecendo proteção de interface e de dados.
4. Exibir mensagens de validação em elementos associados aos campos por IDs acessíveis.
5. Limpar efeitos derivados (`time`) quando a entrada de origem (`date`) muda.
6. Manter regras de calendário em funções puras e pequenas, facilitando leitura e teste isolado.
7. Rodar `npm run check` antes de considerar uma alteração pronta.
8. Preservar a configuração de `noUnusedLocals` e `noUnusedParameters` para detectar código não utilizado durante o type-check.

<a id="aprendizados-tecnicos"></a>

## 📚 Aprendizados Técnicos

- Um formulário tipado se beneficia de separar **estado de edição** (`react-hook-form`) de **estado persistido** (Zustand).
- Um resolver permite que a validação declarativa do Yup participe do fluxo padrão de erros do React Hook Form.
- Regras condicionais devem ser implementadas em duas camadas: na interação, para orientar o usuário, e no schema, para garantir consistência na submissão.
- `useWatch` é suficiente para observar apenas o estado necessário ao layout sem transformar cada campo em estado local.
- A persistência precisa de uma política de limpeza: salvar rascunhos é útil, mas dados confirmados não devem reaparecer no próximo preenchimento.
- Acessibilidade em formulários depende da relação entre campo, estado de erro e mensagem, não apenas da aparência visual.
- Configurações de build, como o `base` relativo, fazem parte do funcionamento do deploy e devem ser tratadas como decisão de implementação.

<a id="proximos-passos"></a>

## 🔄 Próximos Passos

- Extrair o schema e as funções de calendário para módulos próprios, caso o formulário cresça.
- Substituir o `console.log` da submissão por uma integração com uma API quando existir uma camada de backend.
- Adicionar testes para as faixas de horário, domingos, datas mínimas e regra condicional de `otherSubject`.
- Avaliar mensagens de erro e navegação por teclado com testes automatizados de acessibilidade.
- Considerar componentes de campo reutilizáveis se novos formulários compartilharem a mesma estrutura.

---

Notas de estudo técnico por [Victor Martins](https://github.com/VictorMartinsD).

---

<div align="center">

## ENGLISH VERSION

</div>

<a id="technical-overview"></a>

## 📌 Technical Overview

This project is a React application written in TypeScript and bundled with Vite. The form flow is concentrated in [App.tsx](../src/App.tsx), while persisted state is isolated in [event-form-store.ts](../src/store/event-form-store.ts). This separation keeps data definitions and storage operations outside the presentation layer.

The main structure is:

- `src/main.tsx`: checks that `#root` exists, initializes React, and enables `StrictMode`.
- `src/App.tsx`: configures the form, validation rules, conditional fields, and submission flow.
- `src/store/event-form-store.ts`: defines `EventFormData`, initial values, and a persisted Zustand store.
- `src/App.css` and `src/global.css`: separate screen-specific styles from global reset, typography, and visual accessibility rules.
- `vite.config.ts`: configures the React plugin, relative base path, and the `@` alias for `src`.

The result is a small and direct architecture suited to studying the complete lifecycle of a typed form: input, validation, temporary persistence, submission, and cleanup.

<a id="implementation-guide"></a>

## 🧭 Implementation Guide

### 1. Data modeling

The `EventFormData` type is the shared contract between the form and the store. Fields such as `name`, `date`, `time`, `subject`, and `description` are required by the model; `otherSubject` is optional because it only participates when the selected subject is `other`.

`initialFormData` centralizes the empty values used both during initialization and after submission. This avoids duplicating object literals with potentially different shapes.

### 2. React Hook Form integration

`useForm<EventFormData>` receives persisted data as `defaultValues` and integrates `yupResolver(schema)`. Fields are connected through `Controller`, which is useful for keeping a consistent interface with native components and allowing custom `onChange` behavior.

Values observed by `useWatch` drive:

1. character counters;
2. available time options;
3. conditional rendering of `otherSubject`;
4. incremental form persistence.

### 3. Date-dependent rules

The `getDateString`, `isSunday`, and `getAvailableTimes` functions isolate calendar rules. The minimum date is tomorrow; Sundays are rejected; weekdays and Saturdays produce different time ranges.

When the date changes, the selected time is cleared with `setValue("time", "")`. Therefore, an option valid for the previous date cannot remain associated with the new date.

### 4. Persistence and submission

`persist` and `createJSONStorage` save `formData` to `localStorage` under the `event-form-storage` key. A `useEffect` watches form values and calls `saveFormData` to merge partial changes.

After a valid submission, `onSubmit`:

1. clears the store;
2. removes persisted storage;
3. restores `initialFormData`;
4. displays success feedback;
5. logs the submitted data for inspection during the study.

### 5. Execution and quality

The scripts in [package.json](../package.json) cover development (`vite`), builds (`tsc -b && vite build`), ESLint, Prettier, and a combined check. The [`.husky/pre-commit`](../.husky/pre-commit) hook runs `lint-staged`, applying linting and formatting only to modified files.

<a id="concepts-and-technologies"></a>

## 🧠 Concepts and Technologies

- **React 19**: UI composition and lifecycle management with `useState`, `useEffect`, and `StrictMode`.
- **TypeScript**: typing the form payload, Zustand store, and calendar function parameters.
- **React Hook Form**: field management, submission, and error state without creating independent React state for every input.
- **Yup**: declarative schema with basic validations, custom tests, and a conditional `when` rule.
- **`@hookform/resolvers`**: adapter between the Yup schema and React Hook Form's validation lifecycle.
- **Zustand**: minimal store with `saveFormData` and `clearFormData`.
- **`localStorage`**: browser persistence through the `persist` middleware.
- **Vite**: development server, production build, React plugin, and relative `base` configuration.
- **ESLint, Prettier, and lint-staged**: code consistency and automated pre-commit validation.
- **Responsive CSS**: grid, media queries, focus states, and `prefers-reduced-motion` support.

<a id="technical-decisions"></a>

## ⚙️ Technical Decisions

### Schema as the data-rule source

Length limits, required fields, minimum date, unavailable Sundays, and valid times live in the `schema`. This centralizes submission validation, while some interaction rules are handled earlier in the component to improve feedback.

### Time options derived from the date

Times are not stored as a fixed list. `getAvailableTimes` derives options from the selected date, reducing duplicated state and ensuring that the schema validates the same rule used by the interface.

### Merged partial persistence

`saveFormData` accepts `Partial<EventFormData>` and merges the fragment into the current state. This allows each watched change to be persisted without rebuilding every field on each event.

### Responsibility-based CSS

`global.css` contains normalization and general rules; `App.css` contains the screen layout and visual components. CSS variables centralize colors and make theme maintenance easier.

### GitHub Pages-compatible build

Vite's `base: "./"` allows assets to resolve relatively when the build is served from a GitHub Pages project path instead of depending on the domain root.

<a id="resolved-issues"></a>

## 🧩 Resolved Issues

- **A time incompatible with the date**: changing the date clears the previous time and recalculates available options.
- **Native date input selecting Sundays**: `onChange` intercepts the value, restores the previous value, and registers an explicit error.
- **Inconsistent conditional field**: `otherSubject` is rendered only when `subject === "other"` and becomes required in Yup under the same condition.
- **Data lost while filling the form**: `useWatch` combined with Zustand and `localStorage` recovers the draft after reopening the page.
- **Persisted state remaining after submission**: the valid flow clears both the in-memory store and persisted storage.
- **Inaccessible feedback**: error messages use `aria-invalid` and `aria-describedby`; success feedback uses `aria-live="polite"` and `role="status"`.
- **Small-screen layout**: media queries reorganize columns, subject fields, and date/time fields into a single column.

<a id="best-practices"></a>

## 🛠️ Best Practices

1. Keep `EventFormData` shared across the schema, form, and store.
2. Reuse `initialFormData` for initialization and reset.
3. Use `maxLength` on elements and equivalent schema limits, providing both UI and data protection.
4. Display validation messages in elements associated with fields through accessible IDs.
5. Clear derived effects (`time`) when the source input (`date`) changes.
6. Keep calendar rules in small pure functions to make them easier to read and test in isolation.
7. Run `npm run check` before considering a change ready.
8. Preserve `noUnusedLocals` and `noUnusedParameters` to detect unused code during type-checking.

<a id="technical-learnings"></a>

## 📚 Technical Learnings

- A typed form benefits from separating **editing state** (`react-hook-form`) from **persisted state** (Zustand).
- A resolver lets Yup's declarative validation participate in React Hook Form's standard error flow.
- Conditional rules should be implemented in two layers: interaction logic to guide the user and schema validation to guarantee submission consistency.
- `useWatch` is enough to observe only the state needed by the layout without turning every field into local state.
- Persistence needs a cleanup policy: drafts are useful, but confirmed data should not reappear in the next filling session.
- Form accessibility depends on the relationship between a field, its error state, and its message, not only on visual styling.
- Build settings such as a relative `base` are part of deployment behavior and should be treated as implementation decisions.

<a id="next-steps-english"></a>

## 🔄 Next Steps

- Extract the schema and calendar functions into separate modules if the form grows.
- Replace the submission `console.log` with an API integration when a backend layer exists.
- Add tests for time ranges, Sundays, minimum dates, and the conditional `otherSubject` rule.
- Evaluate error messages and keyboard navigation with automated accessibility tests.
- Consider reusable field components if new forms share the same structure.

---

Technical study notes by [Victor Martins](https://github.com/VictorMartinsD).
