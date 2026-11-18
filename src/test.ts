// This file is required by karma.conf.js and loads the specs explicitly.
// El builder de Angular 20 (esbuild) no soporta require.context.
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

import './app/core/auth/session.store.spec';
import './app/core/auth/auth.interceptor.spec';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
  }
);
