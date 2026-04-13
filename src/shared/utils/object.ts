function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export function keysToSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(keysToSnakeCase);
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = toSnakeCase(key);

      if (obj[key] instanceof Date) {
        acc[newKey] = obj[key].toISOString();
      } else {
        acc[newKey] = keysToSnakeCase(obj[key]);
      }

      return acc;
    }, {} as any);
  }

  return obj;
}