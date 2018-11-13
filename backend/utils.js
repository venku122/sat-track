const trackExecutionTime = (func) => {
  const start = Date.now();
  const result = func();
  const end = Date.now();
  console.log(`total execution time: ${end - start}`);
  return result;
}

module.exports = {
  trackExecutionTime
}