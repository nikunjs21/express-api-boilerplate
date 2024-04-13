const catchAsync = (fn: Function) => (req: any, res: any, next: Function) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default catchAsync;
