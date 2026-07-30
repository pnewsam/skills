export function greeting(name, options = {}) {
  const punctuation = options.enthusiastic ? "!!" : "!";
  return `Hello, ${name}${punctuation}`;
}
