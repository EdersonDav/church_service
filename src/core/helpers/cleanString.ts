export const cleanString = (input: string, options?: {
    allowWhitespace?: boolean;
    allowAccents?: boolean;
    allowUnderscore?: boolean;
    allowDash?: boolean;
}): string => {
    const {
        allowWhitespace = false,
        allowAccents = false,
        allowUnderscore = false,
        allowDash = false,
    } = options || {};
    let pattern = 'a-zA-Z0-9';

    if (allowWhitespace) pattern += '\\s';
    if (allowUnderscore) pattern += '_';
    if (allowDash) pattern += '\\-';

    let regex = new RegExp(`[^${pattern}]`, 'g');
    let result = input.replace(regex, '');

    if (!allowAccents) {
        result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    return result.replaceAll('$', '');
}
