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
  name: yup.string().required("Nome é obrigatório"),
  date: yup.string().required("Data é obrigatória"),
  subject: yup.string().required("Selecione um assunto"),
  description: yup
    .string()
    .required("Descrição é obrigatória")
    .min(10, "A descrição precisa ter pelo menos 10 dígitos"),
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="field-group">
            <label htmlFor="name">Nome do evento</label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => <input id="name" type="text" placeholder="Ex: React Summit" {...field} />}
            />
            {errors.name?.message && <span className="error">{errors.name.message}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="date">Data do evento</label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => <input id="date" type="date" {...field} />}
            />
            {errors.date?.message && <span className="error">{errors.date.message}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="subject">Assunto principal</label>
            <Controller
              control={control}
              name="subject"
              render={({ field }) => (
                <select id="subject" {...field}>
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
            {errors.subject?.message && <span className="error">{errors.subject.message}</span>}
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
                  {...field}
                />
              )}
            />
            {errors.description?.message && <span className="error">{errors.description.message}</span>}
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
