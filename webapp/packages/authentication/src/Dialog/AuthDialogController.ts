/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observable, computed } from 'mobx';

import { injectable, IInitializableController, IDestructibleController } from '@dbeaver/core/di';
import { CommonDialogService } from '@dbeaver/core/dialogs';
import { NotificationService } from '@dbeaver/core/eventsLog';
import { GQLErrorCatcher } from '@dbeaver/core/sdk';
import { ErrorDetailsDialog } from '@dbeaver/core/src/app';

import { AuthInfoService } from '../AuthInfoService';
import { AuthProviderService, AuthProvider } from '../AuthProviderService';

@injectable()
export class AuthDialogController implements IInitializableController, IDestructibleController {
  @observable provider: AuthProvider | null = null
  @observable isAuthenticating = false;
  @observable credentials = {};

  get isLoading() {
    return this.authProviderService.providers.isLoading();
  }

  @computed get providers(): AuthProvider[] {
    return this.authProviderService
      .providers
      .data
      .concat()
      .sort(this.compareProviders);
  }

  readonly error = new GQLErrorCatcher();
  private isDistructed = false;
  private close!: () => void;

  constructor(
    private notificationService: NotificationService,
    private authProviderService: AuthProviderService,
    private authInfoService: AuthInfoService,
    private commonDialogService: CommonDialogService,
  ) { }

  init(onClose: () => void) {
    this.close = onClose;
    this.loadProviders();
  }

  destruct(): void {
    this.isDistructed = true;
  }

  login = async () => {
    if (!this.provider || this.isAuthenticating) {
      return;
    }

    this.isAuthenticating = true;
    try {
      await this.authInfoService.login(this.provider.id, this.credentials);
      this.close();
    } catch (exception) {
      if (!this.error.catch(exception) || this.isDistructed) {
        this.notificationService.logException(exception, 'Login failed');
      }
    } finally {
      this.isAuthenticating = false;
    }
  }

  selectProvider = (providerId: string) => {
    this.provider = this.authProviderService
      .providers.data.find(provider => provider.id === providerId) || null;
    this.credentials = {};
  }

  showDetails = () => {
    if (this.error.exception) {
      this.commonDialogService.open(ErrorDetailsDialog, this.error.exception);
    }
  }

  private async loadProviders() {
    try {
      await this.authProviderService.providers.load();
      if (this.providers.length > 0) {
        this.provider = this.providers[0];
      }
    } catch (exception) {
      this.notificationService.logException(exception, 'Can\'t load auth providers');
    }
  }

  private compareProviders = (providerA: AuthProvider, providerB: AuthProvider): number => {
    if (providerA.isDefault === providerB.isDefault)
    {
      return providerA.label.localeCompare(providerB.label);
    }

    if (providerA.isDefault === providerB.isDefault) {
      return 0;
    } if (providerA.isDefault) {
      return 1;
    }
    return -1;
  }
}
