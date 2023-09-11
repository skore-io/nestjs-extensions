import { instanceToPlain, plainToInstance } from 'class-transformer'

interface Constructor<T> {
  new (...args: unknown[]): T
}

export abstract class TransformerUtil {
  static toInstance<T extends TransformerUtil>(this: Constructor<T>, data: unknown): T {
    return plainToInstance(this, data, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    })
  }

  toJson(): object {
    return instanceToPlain(this)
  }
}
