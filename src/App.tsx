import "./App.css";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type FormData = {
  name: string;
  date: string;
  subject: string;
  description: string;
};

function getDateString(daysFromToday = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isSunday(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day).getDay() === 0;
}

const schema = yup.object({
  name: yup.string().trim().required("Nome é obrigatório").max(80, "O nome deve ter no máximo 80 caracteres"),
  date: yup
    .string()
    .required("Data é obrigatória")
    .test("not-today", "Escolha uma data a partir de amanhã", (value) => {
      return !value || value >= getDateString(1);
    })
    .test("not-sunday", "Domingos não estão disponíveis", (value) => {
      return !value || !isSunday(value);
    }),
  subject: yup.string().required("Selecione um assunto"),
  description: yup
    .string()
    .trim()
    .required("Descrição é obrigatória")
    .min(10, "A descrição precisa ter pelo menos 10 caracteres")
    .max(500, "A descrição deve ter no máximo 500 caracteres"),
});

export default function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const minDate = getDateString(1);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      date: "",
      subject: "",
      description: "",
    },
    resolver: yupResolver(schema),
  });

  const nameValue = useWatch({ control, name: "name" });
  const descriptionValue = useWatch({ control, name: "description" });

  function onSubmit(data: FormData) {
    setIsSubmitted(true);
    console.log(data);
  }

  return (
    <main className="page-shell">
      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">Event planning</p>
        <h1 id="page-title">Crie um evento que as pessoas queiram participar.</h1>
        <p className="intro-description">
          Organize os detalhes principais do seu próximo encontro de tecnologia em poucos passos.
        </p>
      </section>

      <section className="form-card" aria-labelledby="form-title">
        <div className="form-heading">
          <p className="step-label">Etapa 01</p>
          <h2 id="form-title">Detalhes do evento</h2>
          <p>
            Preencha as informações para começar a montar sua experiência.
            <span className="form-note">Todos os campos são obrigatórios!</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit, () => setIsSubmitted(false))}>
          <div className="field-group">
            <div className="field-label-row">
              <label htmlFor="name">Nome do evento</label>
              <span className="character-count">{nameValue.length}/80</span>
            </div>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <input
                  id="name"
                  type="text"
                  placeholder="Ex: React Summit"
                  maxLength={80}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  {...field}
                />
              )}
            />
            {errors.name?.message && (
              <span id="name-error" className="error">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="field-group">
            <label htmlFor="date">Data do evento</label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <input
                  id="date"
                  type="date"
                  min={minDate}
                  aria-invalid={Boolean(errors.date)}
                  aria-describedby={errors.date ? "date-error" : undefined}
                  {...field}
                  onChange={(event) => {
                    if (isSunday(event.target.value)) {
                      event.target.value = field.value;
                      return;
                    }

                    field.onChange(event);
                  }}
                />
              )}
            />
            {errors.date?.message && (
              <span id="date-error" className="error">
                {errors.date.message}
              </span>
            )}
          </div>

          <div className="field-group">
            <label htmlFor="subject">Assunto principal</label>
            <Controller
              control={control}
              name="subject"
              render={({ field }) => (
                <select
                  id="subject"
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                  {...field}>
                  <option value="" disabled>
                    Selecione um assunto
                  </option>
                  <option value="react">React</option>
                  <option value="nodejs">Node.js</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                </select>
              )}
            />
            {errors.subject?.message && (
              <span id="subject-error" className="error">
                {errors.subject.message}
              </span>
            )}
          </div>

          <div className="field-group">
            <div className="field-label-row">
              <label htmlFor="description">Descrição</label>
              <span className="character-count">{descriptionValue.length}/500</span>
            </div>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <textarea
                  id="description"
                  placeholder="Conte um pouco sobre o que você está planejando"
                  rows={5}
                  maxLength={500}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? "description-error" : undefined}
                  {...field}
                />
              )}
            />
            {errors.description?.message && (
              <span id="description-error" className="error">
                {errors.description.message}
              </span>
            )}
          </div>

          {isSubmitted && (
            <p className="success-message" role="status">
              Evento salvo com sucesso. Agora você pode continuar o planejamento.
            </p>
          )}

          <button type="submit">Salvar evento</button>
        </form>
      </section>
    </main>
  );
}
