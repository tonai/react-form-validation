import { type FormEvent, useId } from 'react';
import { Form, type IFormContext, type IFormValues } from 'react-swift-form';

export default function Demo() {
  const id = useId();
  const safeId = CSS.escape(id);
  const css = `#${safeId} input:valid {
  background-color: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.8);
  border-radius: 2px;
}
#${safeId} input:invalid {
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.8);
  border-radius: 2px;
}`;

  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  return (
    <Form id={id} onSubmit={handleSubmit} useNativeValidation={false}>
      {({ errors }: IFormContext) => (
        <>
          <style>{css}</style>
          <input name="text" required />
          {errors.all.text && <div className="error">{errors.all.text}</div>}
          <button type="submit">Submit</button>
        </>
      )}
    </Form>
  );
}
