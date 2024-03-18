import type {
  IError,
  IFormContext,
  IFormElement,
  IFormMode,
  IFormRevalidateMode,
  IFormValues,
  ISetValidatorsParams,
  ISubscriber,
  IValidator,
  IValidatorObject,
  IValidityMessages,
} from '../types';
import type { FormEvent, RefObject } from 'react';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { initialError } from '../constants';
import {
  getData,
  getFormInput,
  getValidatorMap,
  getValue,
  isFormElement,
  validateForm,
} from '../helpers';

export interface IUseFormProps {
  defaultValues?: Record<string, unknown>;
  focusOnError?: boolean;
  messages?: IValidityMessages;
  mode?: IFormMode;
  onSubmit?: (event: FormEvent<HTMLFormElement>, values: IFormValues) => void;
  revalidateMode?: IFormRevalidateMode;
  useNativeValidation?: boolean;
  validators?: Record<string, IValidator | IValidatorObject>;
}

export interface IUseFormResult extends IFormContext {
  formProps: {
    noValidate: boolean;
    onChange: (event: FormEvent<HTMLFormElement>) => void;
    onReset: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    ref: RefObject<HTMLFormElement>;
  };
}

export function useForm(props: IUseFormProps = {}): IUseFormResult {
  const {
    defaultValues,
    focusOnError = true,
    onSubmit,
    messages,
    mode = 'submit',
    revalidateMode = 'submit',
    useNativeValidation = true,
    validators,
  } = props;
  const ref = useRef<HTMLFormElement>(null);
  const fields = useRef<Set<ISetValidatorsParams>>(new Set());
  const values = useRef<Record<string, unknown>>(defaultValues ?? {});
  const manualErrors = useRef<Record<string, string | null>>({});
  const [errors, setErrors] = useState<IError>(initialError);

  // Observer
  const subscribers = useRef<ISubscriber[]>([]);
  const subscribe = useCallback((subscriber: ISubscriber) => {
    if (!subscribers.current.includes(subscriber)) {
      subscribers.current.push(subscriber);
    }
    return () =>
      subscribers.current.slice(subscribers.current.indexOf(subscriber), 1);
  }, []);
  const notify = useCallback(() => {
    subscribers.current.forEach((subscriber) => subscriber(ref.current));
  }, []);

  const validate = useCallback(
    (
      display = false,
      revalidate = false,
      focusOnError = false,
      names?: string[] | string | null,
    ) => {
      if (!ref.current) {
        return false;
      }

      const validatorMap = getValidatorMap(
        fields.current,
        validators,
        messages,
      );

      // Validate
      validateForm(
        ref.current,
        validatorMap,
        setErrors,
        display,
        revalidate,
        useNativeValidation,
        values.current,
        manualErrors.current,
        messages,
        focusOnError,
        names instanceof Array ? names : names ? [names] : undefined,
      );

      notify();
      return Boolean(ref.current.checkValidity());
    },
    [messages, notify, useNativeValidation, validators],
  );

  const timer = useRef<NodeJS.Timeout>();
  const debouncedValidate = useCallback(
    (
      display?: boolean,
      revalidate?: boolean,
      focusOnError?: boolean,
      names?: string[] | string | null,
    ) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(
        () => validate(display, revalidate, focusOnError, names),
        0,
      );
    },
    [validate],
  );

  const removeValidators = useCallback(
    (params: ISetValidatorsParams) => {
      fields.current.delete(params);
      debouncedValidate();
    },
    [debouncedValidate],
  );

  const setValidators = useCallback(
    (params: ISetValidatorsParams) => {
      fields.current.add(params);
      debouncedValidate();
    },
    [debouncedValidate],
  );

  const handleChange = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      debouncedValidate(
        mode === 'all' || mode === 'change',
        revalidateMode === 'change',
        false,
        getFormInput(event.target as IFormElement).name,
      );
    },
    [mode, debouncedValidate, revalidateMode],
  );

  const handleReset = useCallback(() => {
    setErrors(initialError);
    const validatorMap = getValidatorMap(fields.current, validators, messages);
    for (const [, set] of validatorMap.entries()) {
      for (const params of set.values()) {
        params.setErrors?.(initialError);
      }
    }
    debouncedValidate();
  }, [debouncedValidate, messages, validators]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      if (validate(true, false, focusOnError) && ref.current) {
        onSubmit?.(event, getData(ref.current, values.current));
      } else {
        event.preventDefault();
      }
    },
    [focusOnError, onSubmit, validate],
  );

  useEffect(() => {
    validate();
  }, [validate]);

  // Manage blur event listeners
  useEffect(() => {
    if (
      ref.current &&
      (mode === 'all' || mode === 'blur' || revalidateMode === 'blur')
    ) {
      const form = ref.current;
      const handleFocusOut = (event: FocusEvent): void => {
        if (event.target && isFormElement(event.target)) {
          validate(
            mode === 'all' || mode === 'blur',
            revalidateMode === 'blur',
            false,
            event.target.getAttribute('name'),
          );
        }
      };
      form.addEventListener('focusout', handleFocusOut);
      return () => form.removeEventListener('focusout', handleFocusOut);
    }
    return undefined;
  }, [mode, revalidateMode, validate]);

  const onError = useCallback(
    (name: string) => {
      return (manualError: string | null) => {
        manualErrors.current[name] = manualError;
        debouncedValidate(
          mode === 'all' || mode === 'change',
          revalidateMode === 'change',
          false,
          name,
        );
      };
    },
    [debouncedValidate, mode, revalidateMode],
  );

  const onChange = useCallback(
    <V, T extends unknown[] = unknown[]>(
      name: string,
      transformer?: ((value: unknown) => V) | null,
      callback?: ((value: V, ...args: T) => void) | null,
      getError?: ((value: V, ...args: T) => string | null) | null,
    ) => {
      return (value: unknown, ...args: T) => {
        let val = getValue(value) as V;
        if (transformer) {
          val = transformer(val);
        }
        values.current[name] = val;
        if (getError) {
          onError(name)(getError(val, ...args));
        }
        debouncedValidate(
          mode === 'all' || mode === 'change',
          revalidateMode === 'change',
          false,
          name,
        );
        callback?.(val, ...args);
      };
    },
    [debouncedValidate, mode, onError, revalidateMode],
  );

  const formProps = useMemo(
    () => ({
      noValidate: !useNativeValidation,
      onChange: handleChange,
      onReset: handleReset,
      onSubmit: handleSubmit,
      ref,
    }),
    [handleChange, handleReset, handleSubmit, useNativeValidation],
  );

  return useMemo(
    () => ({
      errors,
      formProps,
      messages,
      mode,
      onChange,
      onError,
      ref,
      removeValidators,
      revalidateMode,
      setValidators,
      subscribe,
      useNativeValidation,
      validate,
    }),
    [
      errors,
      formProps,
      messages,
      mode,
      onChange,
      onError,
      removeValidators,
      revalidateMode,
      setValidators,
      subscribe,
      useNativeValidation,
      validate,
    ],
  );
}
