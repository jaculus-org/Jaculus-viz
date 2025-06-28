export class TimeoutPromise<T> implements Promise<T> {
  private promise: Promise<T>
  private onTimeout: (() => void) | undefined
  private timeout: NodeJS.Timeout | undefined

  constructor(
    ms: number,
    functor: (resolver: (value: T) => void, rejector: (reason?: unknown) => void) => void,
    onTimeout?: () => void
  ) {
    this.promise = new Promise((resolve, reject) => {
      this.onTimeout = () => {
        if (onTimeout) {
          onTimeout()
        }
        reject(new Error('Timeout'))
      }

      this.timeout = setTimeout(() => {
        if (this.onTimeout) {
          this.onTimeout()
        } else {
          throw new Error('Timeout callback not set')
        }
      }, ms)

      functor(
        (value: T) => {
          clearTimeout(this.timeout)
          resolve(value)
        },
        (reason?: unknown) => {
          clearTimeout(this.timeout)
          reject(reason)
        }
      )
    })
  }

  public then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected)
  }

  public catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<T | TResult> {
    return this.promise.catch(onrejected)
  }

  public finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    return this.promise.finally(onfinally)
  }

  public resetTimeout(ms: number): void {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      if (this.onTimeout) {
        this.onTimeout()
      } else {
        throw new Error('Timeout callback not set')
      }
    }, ms)
  }

  [Symbol.toStringTag] = 'TimeoutPromise'
}
