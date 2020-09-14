type AppThunk<ArgumentType = void, ReturnType = void> = ThunkAction<
  ReturnType,
  defaultStateRoot,
  ArgumentType,
  AnyAction
>;

export default AppThunk;
