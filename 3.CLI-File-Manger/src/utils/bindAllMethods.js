// This function binds all methods of a class instance to the instance itself.
// It ensures that when the methods are called, they have the correct context (the instance).
// This is particularly useful, where methods may be passed as callbacks and lose their context.

export function bindAllMethods(instance) {
  const proto = Object.getPrototypeOf(instance);
  const methodNames = Object.getOwnPropertyNames(proto).filter(
    (name) => typeof instance[name] === "function" && name !== "constructor"
  );

  for (const name of methodNames) {
    instance[name] = instance[name].bind(instance);
  }
}
