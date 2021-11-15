import { container } from 'tsyringe';

import { IDayJsProvider } from './DateProvider/IDayJsProvider';
import { DayJsDateProvider } from './DateProvider/implementations/DayJsDateProvider';
import { IMailProvider } from './MailProvider/IMailProvider';
import { MailTrapProvider } from './MailProvider/implementations/MailTrapProvider';

container.registerInstance<IMailProvider>(
  'MailTrapProvider',
  new MailTrapProvider()
);

container.registerSingleton<IDayJsProvider>(
  'DayJsDateProvider',
  DayJsDateProvider
);
