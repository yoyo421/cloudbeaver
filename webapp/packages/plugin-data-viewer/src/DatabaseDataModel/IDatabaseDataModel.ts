/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import type { IExecutor } from '@cloudbeaver/core-executor';
import type { ResultDataFormat } from '@cloudbeaver/core-sdk';

import type { IDatabaseDataResult } from './IDatabaseDataResult';
import type { DatabaseDataAccessMode, IDatabaseDataSource, IRequestInfo } from './IDatabaseDataSource';

export interface IRequestEventData {
  type: 'before' | 'after';
}

export interface IDatabaseDataModel<TOptions = any, TResult extends IDatabaseDataResult = IDatabaseDataResult> {
  readonly id: string;
  readonly source: IDatabaseDataSource<TOptions, TResult>;
  readonly requestInfo: IRequestInfo;
  readonly supportedDataFormats: ResultDataFormat[];
  readonly countGain: number;

  readonly onOptionsChange: IExecutor;
  readonly onRequest: IExecutor<IRequestEventData>;

  isReadonly: () => boolean;
  isDisabled: (resultIndex: number) => boolean;
  isLoading: () => boolean;
  isDataAvailable: (offset: number, count: number) => boolean;

  getResult: (index: number) => TResult | null;

  setAccess: (access: DatabaseDataAccessMode) => this;
  setCountGain: (count: number) => this;
  setSlice: (offset: number, count?: number) => this;
  setOptions: (options: TOptions) => this;
  setDataFormat: (dataFormat: ResultDataFormat) => this;
  setSupportedDataFormats: (dataFormats: ResultDataFormat[]) => this;

  requestOptionsChange: () => Promise<boolean>;
  requestDataAction: (action: () => Promise<void> | void) => Promise<void>;
  retry: () => Promise<void>;
  save: () => Promise<void>;
  refresh: (concurrent?: boolean) => Promise<void>;
  reload: () => Promise<void>;
  requestDataPortion: (offset: number, count: number) => Promise<void>;
  cancel: () => Promise<void> | void;
  resetData: () => void;
  dispose: () => Promise<void>;
}
