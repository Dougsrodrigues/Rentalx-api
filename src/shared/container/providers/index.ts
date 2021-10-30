import { container } from 'tsyringe';

import { IDayJsProvider } from './DateProvider/IDayJsProvider';
import { DayJsDateProvider } from './DateProvider/implementations/DayJsDateProvider';

container.registerSingleton<IDayJsProvider>(
  'DayJsDateProvider',
  DayJsDateProvider
);
