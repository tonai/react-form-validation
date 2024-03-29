import type { FormEvent } from 'react';

import { act, renderHook } from '@testing-library/react';

import { useForm } from './useForm';

jest.useFakeTimers();

describe('useForm hook', () => {
  let form: HTMLFormElement;
  let input1: HTMLInputElement;
  let input2: HTMLInputElement;

  beforeEach(() => {
    form = document.createElement('form');
    input1 = document.createElement('input');
    input1.setAttribute('name', 'foo');
    input1.setAttribute('value', '');
    form.appendChild(input1);
    input2 = document.createElement('input');
    input2.setAttribute('name', 'bar');
    input2.setAttribute('value', '');
    form.appendChild(input2);
  });

  it('should initialize data', () => {
    const { result } = renderHook(() => useForm());
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
    expect(result.current.formProps.noValidate).toEqual(false);
    expect(result.current.formProps.onChange).toBeDefined();
    expect(result.current.formProps.onReset).toBeDefined();
    expect(result.current.formProps.onSubmit).toBeDefined();
    expect(result.current.formProps.ref).toEqual({ current: null });
    expect(result.current.messages).toEqual(undefined);
    expect(result.current.mode).toEqual('submit');
    expect(result.current.ref).toEqual({ current: null });
    expect(result.current.removeValidators).toBeDefined();
    expect(result.current.revalidateMode).toEqual('submit');
    expect(result.current.setValidators).toBeDefined();
    expect(result.current.subscribe).toBeDefined();
    expect(result.current.useNativeValidation).toEqual(true);
    expect(result.current.validate).toBeDefined();
  });

  it('should initialize data with props', () => {
    const { result } = renderHook(() =>
      useForm({
        messages: { valueMissing: 'Custom message' },
        mode: 'all',
        revalidateMode: 'change',
        useNativeValidation: false,
      }),
    );
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
    expect(result.current.formProps.noValidate).toEqual(true);
    expect(result.current.formProps.onChange).toBeDefined();
    expect(result.current.formProps.onReset).toBeDefined();
    expect(result.current.formProps.onSubmit).toBeDefined();
    expect(result.current.formProps.ref).toEqual({ current: null });
    expect(result.current.messages).toEqual({ valueMissing: 'Custom message' });
    expect(result.current.mode).toEqual('all');
    expect(result.current.ref).toEqual({ current: null });
    expect(result.current.removeValidators).toBeDefined();
    expect(result.current.revalidateMode).toEqual('change');
    expect(result.current.setValidators).toBeDefined();
    expect(result.current.subscribe).toBeDefined();
    expect(result.current.useNativeValidation).toEqual(false);
    expect(result.current.validate).toBeDefined();
  });

  it('should call the onSubmitError handler (props)', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const onSubmitError = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        onSubmit,
        onSubmitError,
      }),
    );
    input1.setAttribute('required', '');
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onSubmitError).toHaveBeenCalled();
  });

  it('should call the onSubmit invalid callback (return)', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const onSubmitError = jest.fn();
    const { result } = renderHook(() => useForm());
    input1.setAttribute('required', '');
    // @ts-expect-error ignore
    result.current.ref.current = form;
    const submitCallback = result.current.onSubmit(onSubmit, onSubmitError);
    submitCallback({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onSubmitError).toHaveBeenCalled();
  });

  it('should call the onSubmit handler (props)', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        onSubmit,
      }),
    );
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should call the onSubmit valid callback (return)', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useForm());
    // @ts-expect-error ignore
    result.current.ref.current = form;
    const submitCallback = result.current.onSubmit(onSubmit);
    submitCallback({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should call the onSubmit handler with default Values (props)', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        defaultValues: { foo: 42 },
        onSubmit,
      }),
    );
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith(expect.any(Object), {
      bar: '',
      foo: 42,
    });
  });

  it('should call the onSubmit valid callback with default Values (return)', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        defaultValues: { foo: 42 },
      }),
    );
    // @ts-expect-error ignore
    result.current.ref.current = form;
    const submitCallback = result.current.onSubmit(onSubmit);
    submitCallback({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith(expect.any(Object), {
      bar: '',
      foo: 42,
    });
  });

  it('should call the onSubmit handler with the form values (props)', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        onSubmit,
      }),
    );
    input1.value = '42';
    input2.value = 'baz';
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.formProps.onSubmit({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith(expect.any(Object), {
      bar: 'baz',
      foo: '42',
    });
  });

  it('should call the onSubmit valid callback with the form values (return)', () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useForm());
    input1.value = '42';
    input2.value = 'baz';
    // @ts-expect-error ignore
    result.current.ref.current = form;
    const submitCallback = result.current.onSubmit(onSubmit);
    submitCallback({
      preventDefault,
    } as unknown as FormEvent<HTMLFormElement>);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith(expect.any(Object), {
      bar: 'baz',
      foo: '42',
    });
  });

  it('should update the values with the onChange callback', () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        onSubmit,
      }),
    );
    input1.value = '42';
    input2.value = 'baz';
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.onChange('foo')(42);
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(expect.any(Object), {
      bar: 'baz',
      foo: 42,
    });
  });

  it('should update the values with the onChange callback using the transformer', () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        onSubmit,
      }),
    );
    input1.value = '42';
    input2.value = 'baz';
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.onChange('foo', Number)({ target: { value: '42' } });
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(expect.any(Object), {
      bar: 'baz',
      foo: 42,
    });
  });

  it('should set the value with the onChange handler', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useForm());
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.onChange('foo', null, onChange)(42);
    expect(onChange).toHaveBeenCalledWith(42);
  });

  it('should add a manual error with the onChange callback (mode=all)', () => {
    const onError = jest.fn(() => 'error');
    const { result } = renderHook(() =>
      useForm({
        mode: 'all',
        useNativeValidation: false,
      }),
    );
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.onChange('foo', null, null, onError)(42);
    expect(onError).toHaveBeenCalledWith(42);
    act(() => jest.runAllTimers());
    expect(result.current.errors).toEqual({
      all: { foo: 'error' },
      global: {},
      main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
      manual: { foo: 'error' },
      native: { foo: '' },
      validator: {},
    });
  });

  it('should add a manual error with the onError callback (mode=all)', () => {
    const { result } = renderHook(() =>
      useForm({
        mode: 'all',
        useNativeValidation: false,
      }),
    );
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.onError('foo')('error');
    act(() => jest.runAllTimers());
    expect(result.current.errors).toEqual({
      all: { foo: 'error' },
      global: {},
      main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
      manual: { foo: 'error' },
      native: { foo: '' },
      validator: {},
    });
  });

  it('should add a manual error with the onError callback (mode=change)', () => {
    const { result } = renderHook(() =>
      useForm({
        mode: 'change',
        useNativeValidation: false,
      }),
    );
    expect(result.current.errors).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.onError('foo')('error');
    act(() => jest.runAllTimers());
    expect(result.current.errors).toEqual({
      all: { foo: 'error' },
      global: {},
      main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
      manual: { foo: 'error' },
      native: { foo: '' },
      validator: {},
    });
  });

  it('should reset the values with the onReset handler', () => {
    const onReset = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        onReset,
        onSubmit,
      }),
    );
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.formProps.onReset(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onReset).toHaveBeenCalled();
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(expect.any(Object), {
      bar: '',
      foo: '',
    });
  });

  it('should reset the values with the onReset callback', () => {
    const onReset = jest.fn();
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useForm({ onSubmit }));
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.onReset(onReset)(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onReset).toHaveBeenCalled();
    // result.current.onChange('foo', Number)({ target: { value: '42' } });
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(expect.any(Object), {
      bar: '',
      foo: '',
    });
  });

  it('should reset the values with defaultValues and the onReset handler return values', () => {
    const onReset = jest.fn(() => ({ foo: 42 }));
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        defaultValues: { bar: 'baz' },
        onReset,
        onSubmit,
      }),
    );
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.formProps.onReset(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onReset).toHaveBeenCalled();
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(expect.any(Object), {
      bar: 'baz',
      foo: 42,
    });
  });

  it('should reset the values with defaultValues and the onReset callback return values', () => {
    const onReset = jest.fn(() => ({ foo: 42 }));
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        defaultValues: { bar: 'baz' },
        onSubmit,
      }),
    );
    // @ts-expect-error ignore
    result.current.ref.current = form;
    result.current.onReset(onReset)(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onReset).toHaveBeenCalled();
    // result.current.onChange('foo', Number)({ target: { value: '42' } });
    result.current.formProps.onSubmit(
      {} as unknown as FormEvent<HTMLFormElement>,
    );
    expect(onSubmit).toHaveBeenCalledWith(expect.any(Object), {
      bar: 'baz',
      foo: 42,
    });
  });
});
