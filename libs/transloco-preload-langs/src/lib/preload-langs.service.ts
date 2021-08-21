import {Inject, Injectable, InjectionToken, OnDestroy} from "@angular/core";
import {TranslocoService} from "@ngneat/transloco";
import {tap} from "rxjs/operators";
import {forkJoin, Subscription} from "rxjs";

export const PRELOAD_LANGUAGES = new InjectionToken<string[]>('Languages to be preloaded');



@Injectable()
export class TranslocoPreloadLangsService implements OnDestroy {
  private readonly idleCallbackId: number | undefined;
  private subscription: Subscription | undefined;
  
  constructor(service: TranslocoService, @Inject(PRELOAD_LANGUAGES) langs: string[]) {
    if (!langs) return;

    this.idleCallbackId = window.requestIdleCallback(() => {
      const preloads = langs.map(currentLangOrScope => {
        const lang = service._completeScopeWithLang(currentLangOrScope);

        return service.load(lang).pipe(
          tap(() => {
            if (service.config.prodMode === false) {
              console.log(`%c 👁 Preloaded ${lang}`, 'background: #fff; color: #607D8B;');
            }
          })
        );
      });
      this.subscription = forkJoin(preloads).subscribe();
    });
  }

  ngOnDestroy() {
    if (this.idleCallbackId !== undefined) {
      window.cancelIdleCallback(this.idleCallbackId);
    }
    this.subscription?.unsubscribe();
  }
}