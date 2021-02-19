// Dependencies
import { Component, ElementRef, Renderer2, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Observable, Subscription, of, merge, pipe, OperatorFunction } from 'rxjs';
import { mergeAll, map, mapTo } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs-exam',
  templateUrl: './rxjs-exam.component.html',
  styleUrls: ['./rxjs-exam.component.less']
})
export class RxjsExComponent implements OnInit, AfterViewInit {

  @ViewChild('oc') oc: ElementRef;
  private observable$: Observable<string>;
  private textObserver: Subscription;

  constructor(
    private renderer2: Renderer2
  ) {
    this.observable$ = Observable.create((o: any) => {
      try {
        o.next('Hello');
        o.next('How are you?');
        setInterval(() => {
          o.next('I am good');
        }, 2000);
      } catch( error ) {
        o.error(error);
      }
    });
  }

  ngAfterViewInit(): void {
    this.textObserver = this.observable$.subscribe((data: string) => {
      const textContainer = this.renderer2.createElement('div');
      this.renderer2.setProperty(textContainer, 'id', 'text-container');
      const text = this.renderer2.createText(data);
      this.renderer2.appendChild(textContainer, text);
      this.renderer2.appendChild(this.oc.nativeElement, textContainer);
    });

    setTimeout(() => {
      this.textObserver.unsubscribe();
    }, 6001);
  }

  ngOnInit(): void {
    this.startOperatorMergeEx();
    this.startOperatorMapEx();
  }

  private startOperatorMergeEx(): void {
    // merge example
    const obs1: Observable<string> = of('Texto1');
    const obs2: Observable<number> = Observable.create(o => o.next(88));
    const resObs: Observable<string | number> = merge(obs1, obs2);
    resObs.subscribe((data: string | number) => {
      console.log(`%c MERGE operator: result ==>`, `color: greenyellow; background-color: black`, data);
    });
    // mergeAll example
    const obsA: Observable<Observable<Object>> = Observable.create(o => {
      o.next(of({
        value: 88
      }));
      o.next(of({
        value: 99
      }));
    });
    const obsB: Observable<Observable<boolean>> = Observable.create(o => o.next(of(true)));
    const resultMergeAll = merge(obsA, obsB).pipe(mergeAll());
    resultMergeAll.subscribe(
      (result: any) => {
        console.log(`%c MERGEALL operator: result ==>`, `color: greenyellow; background-color: black`, result);
      }
    );
  }

  private startOperatorMapEx(): void {
    // map example
    const obs1: Observable<string> = Observable .create( o => {
      o.next('Soy');
      o.next('Crgio');
      o.next('Peca');
      o.next('88');
      o.complete();
    });
    const obsMap: Observable<Object> = obs1.pipe(
      map((text: string) => {
        return ({
          value: text.toUpperCase()
        });
      })
    );
    obsMap.subscribe((obj: Object) => {
      console.log(`%c MAP operator: result ==>`, `color: yellow; background-color: green`, obj);
    });

    // mapTo example
    const obsMapTo: Observable<Object> = obsMap.pipe(
      mapTo({
        username: 'crgio mapTo',
        password: 'crgio password'
      })
    );
    obsMapTo.subscribe((objMapTo: Object) => {
      console.log(`%c MAPTO operator: result ==>`, `color: yellow; background-color: green`, objMapTo);
    });
  }

}
