import type {
  IFormElement,
  IFormValidator,
  IMessages,
  ISetValidatorsParams,
  IValidator,
  IValidatorObject,
} from '../types';

import { isValidator, isValidatorObject } from './validator';

export function insertInMapSet<T>(
  map: Map<string, Set<T>>,
  name: string,
  x: T,
): void {
  if (!map.has(name)) {
    map.set(name, new Set([x]));
  } else {
    const set = map.get(name);
    set?.add(x);
  }
}

export function isFormElement(
  input: Element | EventTarget | RadioNodeList,
): input is IFormElement {
  return (
    input instanceof HTMLInputElement ||
    input instanceof HTMLSelectElement ||
    input instanceof HTMLTextAreaElement ||
    input instanceof RadioNodeList
  );
}

const disallowedInputTypes = ['submit', 'reset'];
export function getFormInputs(form: HTMLFormElement): IFormElement[] {
  return [...form.elements].filter(
    (input) =>
      isFormElement(input) &&
      input.getAttribute('name') &&
      !disallowedInputTypes.includes(input.type),
  ) as IFormElement[];
}

export function getValidatorMap(
  fieldValidators: Set<ISetValidatorsParams>,
  formValidators?: Record<string, IValidator | IValidatorObject>,
  messages?: IMessages,
): Map<string, Set<IFormValidator>> {
  const validatorMap = new Map<string, Set<IFormValidator>>();

  // Field validators
  for (const params of fieldValidators.values()) {
    const { validators, ...validatorParams } = params;
    for (const name of params.names) {
      insertInMapSet(validatorMap, name, validatorParams);
    }

    if (!validators) {
      continue;
    } else if (isValidator(validators)) {
      for (const name of params.names) {
        insertInMapSet(validatorMap, name, {
          ...validatorParams,
          validator: validators,
        });
      }
    } else if (isValidatorObject(validators)) {
      const { names: validatorNames, validator } = validators;
      for (const name of validatorNames) {
        insertInMapSet(validatorMap, name, {
          ...validatorParams,
          names: validatorNames,
          validator,
        });
      }
    } else {
      for (const [id, value] of Object.entries(validators)) {
        if (isValidator(value)) {
          insertInMapSet(validatorMap, id, {
            ...validatorParams,
            id,
            names: [id],
            validator: value,
          });
        } else {
          const { names: validatorNames, validator } = value;
          for (const name of validatorNames) {
            insertInMapSet(validatorMap, name, {
              ...validatorParams,
              id,
              names: validatorNames,
              validator,
            });
          }
        }
      }
    }
  }

  // Form validators
  if (formValidators) {
    for (const [id, value] of Object.entries(formValidators)) {
      if (isValidator(value)) {
        insertInMapSet(validatorMap, id, {
          id,
          messages,
          names: [id],
          validator: value,
        });
      } else {
        const { names: validatorNames, validator } = value;
        for (const name of validatorNames) {
          insertInMapSet(validatorMap, name, {
            id,
            messages,
            names: validatorNames,
            validator,
          });
        }
      }
    }
  }

  return validatorMap;
}

export function isEvent(event: unknown): event is Event {
  return Boolean(
    typeof event === 'object' && event !== null && 'target' in event,
  );
}

export function isCheckbox(target: EventTarget): target is HTMLInputElement {
  return Boolean('type' in target && target.type === 'checkbox');
}

export function getValue(event: unknown): unknown {
  if (isEvent(event) && event.target) {
    if (isCheckbox(event.target)) {
      return event.target.checked;
    }
    if ('value' in event.target) {
      return event.target.value;
    }
  }
  return event;
}
