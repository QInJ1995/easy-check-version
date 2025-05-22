import { CheckMethod, CheckOptions } from './core';

export interface VersionCheckPluginOptions extends CheckOptions {
  method?: CheckMethod;
} 