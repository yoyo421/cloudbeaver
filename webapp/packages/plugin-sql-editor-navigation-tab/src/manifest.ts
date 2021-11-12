/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import type { PluginManifest } from '@cloudbeaver/core-di';

import { LocaleService } from './LocaleService';
import { SqlDialectInfoService } from './SqlDialectInfoService';
import { SqlEditorBootstrap } from './SqlEditorBootstrap';
import { SqlEditorNavigatorService } from './SqlEditorNavigatorService';
import { SqlEditorService } from './SqlEditorService';
import { SqlEditorSettingsService } from './SqlEditorSettingsService';
import { SqlEditorTabService } from './SqlEditorTabService';
import { SqlExecutionPlanService } from './SqlResultTabs/ExecutionPlan/SqlExecutionPlanService';
import { SqlQueryResultService } from './SqlResultTabs/SqlQueryResultService';
import { SqlQueryService } from './SqlResultTabs/SqlQueryService';
import { SqlResultTabsService } from './SqlResultTabs/SqlResultTabsService';

export const sqlEditorTabPluginManifest: PluginManifest = {
  info: {
    name: 'Sql Editor Plugin',
  },

  providers: [
    SqlEditorBootstrap,
    SqlDialectInfoService,
    SqlEditorTabService,
    SqlQueryResultService,
    SqlQueryService,
    SqlExecutionPlanService,
    SqlResultTabsService,
    SqlEditorService,
    SqlEditorNavigatorService,
    LocaleService,
    SqlEditorSettingsService,
  ],
};