/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { AnnotationsMap, makeObservable } from 'mobx';
import { useState } from 'react';

export function useObservableRef<T extends Record<any, any>>(
  init: () => T & ThisType<T>,
  observed: AnnotationsMap<T, never>,
  update: false,
  bind?: Array<keyof T>
): T;
export function useObservableRef<T extends Record<any, any>, U extends Record<any, any>>(
  init: () => T & ThisType<T & U>,
  observed: AnnotationsMap<T & U, never>,
  update: U & ThisType<T & U>,
  bind?: Array<keyof (T & U)>
): T & U;
export function useObservableRef<T extends Record<any, any>>(
  init: T & ThisType<T>,
  observed: AnnotationsMap<T, never>,
  bind?: Array<keyof T>
): T;
export function useObservableRef<T extends Record<any, any>>(
  init: () => Partial<T> & ThisType<T>,
  observed: AnnotationsMap<T, never>,
  update: Partial<T> & ThisType<T>,
  bind?: Array<keyof T>
): T;
export function useObservableRef<T extends Record<any, any>>(
  init: T | (() => T),
  observed: AnnotationsMap<T, never>,
  update?: Array<keyof T> | T | false,
  bind?: Array<keyof T>
): T {
  if (Array.isArray(update)) {
    bind = update;
    update = undefined;
  }

  if (update === undefined) {
    update = typeof init === 'function' ? init() : init;
  }

  const [state] = useState(() => {
    const state = typeof init === 'function' ? init() : init;

    if (update) {
      Object.assign(state, update);
      update = undefined;
    }

    makeObservable(state, observed, { deep: false });

    if (bind) {
      bindFunctions(state, bind);
    }

    return state;
  });

  if (update) {
    Object.assign(state, update);

    if (bind) {
      bind = bind.filter(key => (key as any) in (update as T));

      if (bind.length > 0) {
        bindFunctions(state, bind);
      }
    }
  }

  return state;
}

function bindFunctions<T>(object: T, keys: Array<keyof T>): void {
  for (const key of keys) {
    const value = object[key];

    if (typeof value === 'function') {
      object[key] = value.bind(object);
    }
  }
}