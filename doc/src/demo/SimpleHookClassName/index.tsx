import type { FormEvent } from 'react';
import { type IFormValues, useForm } from 'react-swift-form';
import clsx from 'clsx';

export default function Demo() {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  const { errors, formProps } = useForm({
    onSubmit: handleSubmit,
    useNativeValidation: false,
  });

  return (
    <form {...formProps}>
      <input
        className={clsx({ 'has-error': errors.all.text })}
        name="text"
        required
      />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
      <button type="submit">Submit</button>
    </form>
  );
}
