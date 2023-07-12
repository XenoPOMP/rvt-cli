export type FunctionWithProps<Args, Return extends any = any> = (
  args: Args,
) => Return;

export type FP<Args, Return extends any = any> = FunctionWithProps<
  Args,
  Return
>;
