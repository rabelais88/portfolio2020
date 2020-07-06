function checkNum(arg: string): boolean {
  const re = new RegExp('[0-9]+', 'gi');
  return re.test(arg);
}

export default checkNum;
