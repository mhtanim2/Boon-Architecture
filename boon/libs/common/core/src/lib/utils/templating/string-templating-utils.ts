import { evaluate } from '@bluemarblepayroll/stringent';
import { get } from 'lodash';

export type InputEvaluationResolver = (placeholder: string, meta: unknown) => boolean;
export const dotNotationResolver: InputEvaluationResolver = (placeholder: string, meta: unknown) =>
  meta && placeholder && get(meta, placeholder);

export const evaluateInput = (
  input: string,
  meta: unknown,
  resolver: InputEvaluationResolver = dotNotationResolver
): string => {
  try {
    const evaluated = meta && Object.keys(meta).length > 0 ? evaluate(input, meta, resolver) : input;

    return evaluated;
  } catch (err) {
    return input;
  }
};
