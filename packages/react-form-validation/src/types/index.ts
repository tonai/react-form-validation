import type { Dispatch, FormEvent, RefObject, SetStateAction } from 'react';

export type IFormElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | RadioNodeList;

export type IFormMode = 'all' | 'blur' | 'change' | 'submit';

export type IFormRevalidateMode = 'blur' | 'change' | 'submit';

export type IValidityMessages = Partial<Record<keyof ValidityState, string>>;

export type IMessages = Record<string, string>;

export type IValidate = (
  mode: IFormMode,
  formData: FormData,
  name?: string,
) => IError;

export type IFormValidate = (
  display?: boolean,
  revalidate?: boolean,
  focusOnError?: boolean,
  name?: string[] | string,
) => [boolean, IError];

export type IFormValues = Record<string, unknown>;

export type IValidator = (values: IFormValues, names: string[]) => string;

export interface IValidatorObject {
  names: string[];
  validator: IValidator;
}

export interface ISetValidatorsParams {
  id: string;
  messages?: IMessages;
  names: string[];
  setErrors?: Dispatch<SetStateAction<IError>>;
  validators?:
    | IValidator
    | IValidatorObject
    | Record<string, IValidator | IValidatorObject>;
}

export interface IFormValidator {
  id: string;
  messages?: IMessages;
  names: string[];
  setErrors?: Dispatch<SetStateAction<IError>>;
  validator?: IValidator;
}

export type ISetValidators = (params: ISetValidatorsParams) => void;

export type IRemoveValidators = (params: ISetValidatorsParams) => void;

export interface IMainError {
  error: string;
  global: boolean;
  id: string;
  names: string[];
}

export interface IValidatorError {
  error: string;
  global: boolean;
  names: string[];
}

export interface IError {
  all: Record<string, string>;
  global: Record<string, IValidatorError>;
  main?: IMainError;
  manual: Record<string, string | null>;
  native: Record<string, string>;
  validator: Record<string, IValidatorError>;
}

export type ISubscriber = (form: HTMLFormElement | null) => void;

export type IUnSubscribe = () => void;

export type IErrorHandler = (error: string | null) => void;

export type IOnErrorHandler = (name: string) => IErrorHandler;

export type IOnChangeHandler = <V, T extends unknown[] = unknown[]>(
  name: string,
  transformer?: ((value: unknown) => V) | null,
  callback?: ((value: V, ...args: T) => void) | null,
  getError?: ((value: V, ...args: T) => string | null) | null,
) => (value: unknown, ...args: T) => void;

export type IResetHandler = (
  event: FormEvent<HTMLFormElement>,
  values: IFormValues,
) => Record<string, unknown> | null | void;

export type IOnResetHandler = (
  callback?: IResetHandler,
) => (event: FormEvent<HTMLFormElement>) => void;

export type ISubmitHandler = (
  event: FormEvent<HTMLFormElement>,
  values: IFormValues,
) => void;

export type ISubmitErrorHandler = (
  event: FormEvent<HTMLFormElement>,
  error: IError,
) => void;

export type IOnSubmitHandler = (
  validCallback?: ISubmitHandler,
  invalidCallback?: ISubmitErrorHandler,
) => (event: FormEvent<HTMLFormElement>) => void;

export interface IFormHandlers {
  onChange: IOnChangeHandler;
  onError: IOnErrorHandler;
  onReset: IOnResetHandler;
  onSubmit: IOnSubmitHandler;
}

export interface IFormContext extends IFormHandlers {
  errors: IError;
  messages?: IMessages;
  mode: IFormMode;
  ref: RefObject<HTMLFormElement>;
  removeValidators: IRemoveValidators;
  revalidateMode: IFormRevalidateMode;
  setValidators: ISetValidators;
  subscribe: (subscriber: ISubscriber) => IUnSubscribe;
  useNativeValidation: boolean;
  validate: IFormValidate;
}
