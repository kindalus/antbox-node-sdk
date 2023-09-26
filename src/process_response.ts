import { Either, right, left } from "./either";
import { AntboxError } from "./antbox_error";

export function toVoid(): Promise<void> {
  return Promise.resolve();
}

export function toObject<T>(res: Response): Promise<T> {
  return res.json();
}

export function processResponse<T>(
  fn: (res: Response) => Promise<T>
): (res: Response) => Promise<Either<AntboxError, T>> {
  return (res) => {
    if (res.ok) {
      return fn(res).then((v) => right(v));
    }

    if (res.status === 400) {
      return Promise.resolve(left("BadRequestError"));
    }

    if (res.status === 404) {
      return Promise.resolve(left("NotFoundError"));
    }

    if (res.status === 403) {
      return Promise.resolve(left("ForbiddenError"));
    }

    if (res.status === 500) {
      return Promise.resolve(left("ServerError"));
    }

    return Promise.resolve(left("ServerError"));
  };
}
