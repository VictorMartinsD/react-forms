import "./App.css";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type FormData = {
  name: string;
  date: string;
  subject: string;
  description: string;
};

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Nome é obrigatório")
    .max(80, "O nome deve ter no máximo 80 caracteres"),
  date: yup.string().required("Data é obrigatória"),
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
          <p>Preencha as informações para começar a montar sua experiência.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit, () => setIsSubmitted(false))}>
          <div className="field-group">
            <label htmlFor="name">Nome do evento</label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <input
                  id="name"
                  type="text"
                  placeholder="Ex: React Summit"
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
                  aria-invalid={Boolean(errors.date)}
                  aria-describedby={errors.date ? "date-error" : undefined}
                  {...field}
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
                  {...field}
                >
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
            <label htmlFor="description">Descrição</label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <textarea
                  id="description"
                  placeholder="Conte um pouco sobre o que você está planejando"
                  rows={5}
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
