import "./App.css";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { initialFormData, useEventFormStore, type EventFormData } from "./store/event-form-store";

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

function getAvailableTimes(dateValue: string) {
  if (!dateValue || isSunday(dateValue)) {
    return [];
  }

  const [year, month, day] = dateValue.split("-").map(Number);
  const dayOfWeek = new Date(year, month - 1, day).getDay();
  const startHour = dayOfWeek === 6 ? 9 : 8;
  const endHour = dayOfWeek === 6 ? 13 : 18;

  return Array.from({ length: endHour - startHour + 1 }, (_, index) => {
    return `${String(startHour + index).padStart(2, "0")}:00`;
  });
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
  time: yup
    .string()
    .required("Horário é obrigatório")
    .test("available-time", "Escolha um horário disponível", function (value) {
      const { date } = this.parent as EventFormData;
      return !value || getAvailableTimes(date).includes(value);
    }),
  subject: yup.string().required("Selecione um assunto"),
  otherSubject: yup.string().when("subject", {
    is: "other",
    then: (fieldSchema) =>
      fieldSchema.trim().required("Informe o outro assunto").max(15, "O assunto deve ter no máximo 15 caracteres"),
    otherwise: (fieldSchema) => fieldSchema.notRequired(),
  }),
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
  const savedFormData = useEventFormStore.getState().formData;
  const saveFormData = useEventFormStore((state) => state.saveFormData);

  const {
    control,
    clearErrors,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    defaultValues: savedFormData ?? initialFormData,
    resolver: yupResolver(schema),
  });

  const formValues = useWatch({ control });
  const nameValue = formValues.name ?? "";
  const dateValue = formValues.date ?? "";
  const subjectValue = formValues.subject ?? "";
  const descriptionValue = formValues.description ?? "";
  const timeOptions = getAvailableTimes(dateValue);

  useEffect(() => {
    saveFormData(formValues);
  }, [formValues, saveFormData]);

  function onSubmit(data: EventFormData) {
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
            <span id="name-error" className="error">
              {errors.name?.message}
            </span>
          </div>

          <div className="date-time-fields">
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
                        setError("date", {
                          type: "validate",
                          message: "Domingos não estão disponíveis",
                        });
                        return;
                      }

                      clearErrors("date");
                      field.onChange(event);
                      setValue("time", "");
                    }}
                  />
                )}
              />
              <span id="date-error" className="error">
                {errors.date?.message}
              </span>
            </div>

            <div className="field-group">
              <label htmlFor="time">Horário</label>
              <Controller
                control={control}
                name="time"
                render={({ field }) => (
                  <select
                    id="time"
                    disabled={!dateValue || timeOptions.length === 0}
                    aria-invalid={Boolean(errors.time)}
                    aria-describedby={errors.time ? "time-error" : undefined}
                    {...field}>
                    <option value="" disabled>
                      {dateValue ? "Selecione um horário" : "Selecione data primeiro"}
                    </option>
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                )}
              />
              <span id="time-error" className="error">
                {errors.time?.message}
              </span>
            </div>
          </div>

          <div className={`subject-fields${subjectValue === "other" ? " has-other" : ""}`}>
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
                    <option value="other">Outro</option>
                  </select>
                )}
              />
              <span id="subject-error" className="error">
                {errors.subject?.message}
              </span>
            </div>

            {subjectValue === "other" && (
              <div className="field-group">
                <label htmlFor="otherSubject">Outro assunto</label>
                <Controller
                  control={control}
                  name="otherSubject"
                  render={({ field }) => (
                    <input
                      id="otherSubject"
                      type="text"
                      placeholder="Digite o assunto"
                      maxLength={15}
                      aria-invalid={Boolean(errors.otherSubject)}
                      aria-describedby={errors.otherSubject ? "other-subject-error" : undefined}
                      {...field}
                    />
                  )}
                />
                <span id="other-subject-error" className="error">
                  {errors.otherSubject?.message}
                </span>
              </div>
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
                  rows={4}
                  maxLength={500}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? "description-error" : undefined}
                  {...field}
                />
              )}
            />
            <span id="description-error" className="error">
              {errors.description?.message}
            </span>
          </div>

          <div className={`submission-feedback${isSubmitted ? " is-visible" : ""}`} aria-live="polite">
            <p className="success-message" role="status">
              Evento salvo com sucesso. Agora você pode continuar o planejamento.
            </p>
          </div>

          <button type="submit">Salvar evento</button>
        </form>
      </section>

      <footer className="site-footer">
        Crafted with precision by{" "}
        <a href="https://github.com/VictorMartinsD" target="_blank" rel="noreferrer">
          Victor Martins Dias
        </a>{" "}
        © 2026
      </footer>
    </main>
  );
}
