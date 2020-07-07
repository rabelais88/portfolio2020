type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  defaultStateRoot,
  unknown,
  AnyAction
>;

export default AppThunk;
