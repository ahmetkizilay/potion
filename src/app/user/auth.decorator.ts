import { UserService } from './user.service';
import { filter, firstValueFrom } from 'rxjs';

export interface WithUserService {
  userService: UserService;
}

/**
 * Wait for user to be signed in before executing the method.
 * @param waitTime Maximum time to wait for user to be signed in. Otherwise, the method will reject.
 */
export function WaitForUser(waitTime: number = 2000) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: WithUserService, ...args: any[]) {
      await Promise.race([
        firstValueFrom(
          this.userService.isSignedIn$.pipe(
            filter((isSignedIn) => !!isSignedIn)
          )
        ),
        new Promise((_resolve, reject) => setTimeout(reject, waitTime)),
      ]);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
