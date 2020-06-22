/**
 * @function asyncHandler
 * @param {Function} func
 * @param  {...any} args
 * @caveat must pass
 */
function asyncHandler(func, ...args) {
  return new Promise((resolve) => {
    try {
      func(...args)
        .then((res) => {
          resolve({ result: res, error: null, errorCode: null });
        })
        .catch((err) => {
          const { statusCode } = (err || {}).data || {}; // statusCodeExample
          resolve({ result: null, error: err, errorCode: statusCode });
        });
    } catch (err) {
      resolve({ result: null, error: err, statusCode: -1 });
    }
  });
}

export default asyncHandler;
