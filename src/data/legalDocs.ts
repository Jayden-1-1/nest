export type LegalDocId = 
  | 'privacy-guarantee' 
  | 'privacy-policy' 
  | 'terms-of-service' 
  | 'cookie-policy' 
  | 'data-deletion' 
  | 'security' 
  | 'contact';

export interface LegalSection {
  title: string;
  content: string[];
}

export interface LegalDocument {
  id: LegalDocId;
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export const LEGAL_DOCS_RU: Record<LegalDocId, LegalDocument> = {
  'privacy-guarantee': {
    id: 'privacy-guarantee',
    title: 'Гарантия приватности и защиты данных',
    subtitle: 'Официальный манифест суверенного цифрового пространства NEST',
    lastUpdated: '8 октября 2026 г.',
    sections: [
      {
        title: '1. Фундаментальный принцип: Дом принадлежит вам',
        content: [
          'Платформа NEST создана как суверенная семейная операционная система, в которой приватность является не опцией настройки, а базовым архитектурным свойством.',
          'Мы исходим из простого правила: всё, что происходит внутри вашего Дома — повседневные задачи, успеваемость, личные комментарии, файлы и фотографии — принадлежит исключительно вашей семье и никогда не должно становиться товаром.',
        ],
      },
      {
        title: '2. Нулевая монетизация личных данных',
        content: [
          'NEST не продаёт, не сдаёт в аренду, не лицензирует и не передаёт личные данные пользователей рекламным сетям, брокерам данных, аналитическим агрегаторам или сторонним коммерческим организациям.',
          'Внутри платформы полностью отсутствует рекламный код, поведенческий трекинг и скрытые маркетинговые пиксели.',
        ],
      },
      {
        title: '3. Какие данные сохраняются и зачем',
        content: [
          '• Профиль: отображаемое имя, никнейм (@ник), адрес электронной почты и выбранный аватар (предустановленный или загруженное вами фото). Эти данные необходимы для авторизации и идентификации участников в задачах.',
          '• Пространства Дома: название Дома, выбранная визуальная атмосфера, сгенерированные коды приглашений и списки участников с их ролями.',
          '• Содержимое задач: заголовки, описания, сроки выполнения, приоритеты, учебные предметы, статусы готовности, прикреплённые файлы и комментарии.',
          'Все указанные данные используются строго для обеспечения совместной работы членов вашей семьи.',
        ],
      },
      {
        title: '4. Кто имеет доступ к содержимому вашего Дома',
        content: [
          'Доступ к информации внутри Дома имеют исключительно те пользователи, которые были добавлены владельцем или присоединились по индивидуальному коду приглашения.',
          'В NEST нет публичных профилей, открытых лент или индексации содержимого поисковыми роботами.',
        ],
      },
      {
        title: '5. Обработка загружаемых файлов и фотографий',
        content: [
          'Файлы, прикрепляемые к задачам (сканы решений, рефераты, документы PDF), и фотографии профиля обрабатываются локально на стороне вашего устройства через стандартные API браузера.',
          'Файлы не подвергаются машинному обучению, не сканируются для создания рекламных профилей и доступны только в контексте соответствующей задачи.',
        ],
      },
      {
        title: '6. Полный контроль и право на удаление',
        content: [
          'Вы имеете абсолютное право удалить любую созданную задачу, вложение, комментарий или весь Дом целиком в любой момент времени.',
          'При удалении Дома владельцем все связанные с ним задачи и записи исключаются безвозвратно.',
        ],
      },
      {
        title: '7. Прямой контакт по вопросам конфиденциальности',
        content: [
          'По любым вопросам защиты данных и приватности вы можете напрямую связаться с нашей командой: privacy@nest.family.',
        ],
      },
    ],
  },

  'privacy-policy': {
    id: 'privacy-policy',
    title: 'Политика конфиденциальности',
    subtitle: 'Порядок сбора, хранения и обработки пользовательских данных',
    lastUpdated: '8 октября 2026 г.',
    sections: [
      {
        title: '1. Общие положения',
        content: [
          'Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональной информации пользователей платформы NEST.',
          'Используя NEST, вы соглашаетесь с условиями сбора и использования информации в соответствии с данным документом.',
        ],
      },
      {
        title: '2. Категории обрабатываемых данных',
        content: [
          'Мы обрабатываем минимальный объём данных, технически необходимый для функционирования сервиса:',
          '• Регистрационные данные: имя, никнейм, email, пароль в защищённом виде.',
          '• Пользовательский контент: задачи, комментарии, отметки о сдаче, пользовательские аватары.',
          '• Технические параметры сессии: язык интерфейса, выбранная тема (светлая/тёмная), выбранная атмосфера Дома.',
        ],
      },
      {
        title: '3. Правовые основания обработки',
        content: [
          'Обработка данных осуществляется на основании согласия пользователя при регистрации и необходимости исполнения пользовательского соглашения для предоставления функций сервиса.',
        ],
      },
      {
        title: '4. Хранение данных и безопасность',
        content: [
          'Сессионные данные и локальное состояние сохраняются в изолированном пространстве браузера (Web Storage API). Передача данных защищена протоколом шифрования TLS/HTTPS.',
        ],
      },
      {
        title: '5. Права субъекта персональных данных',
        content: [
          'Пользователь вправе в любой момент:',
          '• Запросить выгрузку своих данных;',
          '• Исправить неточные или устаревшие сведения в профиле;',
          '• Отозвать согласие и удалить свой аккаунт вместе со всеми данными.',
        ],
      },
    ],
  },

  'terms-of-service': {
    id: 'terms-of-service',
    title: 'Условия использования',
    subtitle: 'Правила взаимодействия и взаимные обязательства',
    lastUpdated: '8 октября 2026 г.',
    sections: [
      {
        title: '1. Назначение сервиса',
        content: [
          'NEST представляет собой цифровую среду для организации семейных задач, распределения домашних обязанностей и контроля учебного процесса.',
          'Сервис предназначен для личного, семейного и некоммерческого образовательного использования.',
        ],
      },
      {
        title: '2. Аккаунты и ответственность',
        content: [
          'Пользователь несёт ответственность за сохранность своих учётных данных и за действия, совершённые с использованием его учётной записи.',
          'Владелец Дома самостоятельно определяет круг приглашаемых участников и распределяет между ними роли (Владелец, Родитель, Участник).',
        ],
      },
      {
        title: '3. Интеллектуальная собственность',
        content: [
          'Все права на визуальный стиль, логотипы, архитектурный интерфейс и код NEST принадлежат создателям платформы.',
          'Весь контент, созданный пользователем (тексты задач, решения, заметки, загруженные материалы), остаётся исключительной собственностью пользователя.',
        ],
      },
      {
        title: '4. Допустимое использование',
        content: [
          'Запрещается использовать платформу для распространения вредоносного ПО, преследования, нарушения прав третьих лиц или размещения противоправных материалов.',
        ],
      },
      {
        title: '5. Ограничение ответственности',
        content: [
          'Сервис предоставляется по принципу «как есть» (as is). Мы прилагаем все усилия для обеспечения непрерывной и стабильной работы платформы.',
        ],
      },
    ],
  },

  'cookie-policy': {
    id: 'cookie-policy',
    title: 'Политика использования файлов cookie',
    subtitle: 'Прозрачная информация о хранении локального состояния',
    lastUpdated: '8 октября 2026 г.',
    sections: [
      {
        title: '1. Нулевое использование рекламных cookie',
        content: [
          'NEST категорически не использует сторонние рекламные, маркетинговые или кросс-сайтовые файлы cookie для отслеживания поведения пользователей.',
        ],
      },
      {
        title: '2. Исключительно техническое хранилище (LocalStorage)',
        content: [
          'Вместо инвазивных cookies платформа использует стандартное локальное хранилище браузера (LocalStorage) исключительно для критически важных технических задач:',
          '• Сохранение активной сессии текущего пользователя;',
          '• Запоминание выбранной темы оформления (Светлая / Тёмная);',
          '• Сохранение выбранного языка интерфейса (Русский / Английский);',
          '• Хранение выбранной атмосферы Дома (Midnight, Clouds, Sunset, Ocean, Aurora).',
        ],
      },
      {
        title: '3. Управление локальными данными',
        content: [
          'Вы можете в любой момент очистить локальное хранилище браузера в настройках программы или через меню очистки истории браузера. Это сбросит локальную сессию без ущерба для вашего устройства.',
        ],
      },
    ],
  },

  'data-deletion': {
    id: 'data-deletion',
    title: 'Политика удаления данных',
    subtitle: 'Процедура полного и безвозвратного стирания информации',
    lastUpdated: '8 октября 2026 г.',
    sections: [
      {
        title: '1. Право на забвение',
        content: [
          'Каждый пользователь NEST имеет безусловное право на полное удаление своих личных данных и созданного им содержимого.',
        ],
      },
      {
        title: '2. Удаление отдельных элементов',
        content: [
          '• Задачи: могут быть удалены автором задачи, родителем или владельцем Дома в карточке задачи.',
          '• Комментарии и вложения: удаляются непосредственно внутри диалога задачи.',
          '• Участники: могут быть исключены из Дома владельцем в разделе «Участники».',
        ],
      },
      {
        title: '3. Удаление целого Дома',
        content: [
          'Владелец Дома может удалить всё пространство целиком в разделе «Настройки» → «Дом» → «Опасная зона». При подтверждении удаления стираются все задачи, история и списки участников без возможности восстановления.',
        ],
      },
      {
        title: '4. Сброс локального профиля и выход',
        content: [
          'Нажатие кнопки «Выйти» очищает активную локальную сессию на текущем устройстве.',
        ],
      },
    ],
  },

  'security': {
    id: 'security',
    title: 'Безопасность системы',
    subtitle: 'Архитектурные принципы изоляции и защиты семейных пространств',
    lastUpdated: '8 октября 2026 г.',
    sections: [
      {
        title: '1. Изоляция пространств Дома',
        content: [
          'Каждый Дом в NEST представляет собой автономную изолированную среду. Пользователи, не состоящие в данном Доме, не могут просматривать его задачи, участников или хронику.',
        ],
      },
      {
        title: '2. Криптографические коды приглашений',
        content: [
          'Вступление в Дом осуществляется по уникальным 6-значным алфавитно-цифровым кодам. Владелец в любой момент может изменить код или исключить любого участника.',
        ],
      },
      {
        title: '3. Ролевое разграничение прав доступа (RBAC)',
        content: [
          '• Владелец: полный административный контроль над Домом, участниками и параметрами.',
          '• Родитель: создание задач, проверка выполнения, отправка на доработку.',
          '• Участник: выполнение назначенных поручений, сдача результатов, обсуждение.',
          'Права проверяются на каждом этапе взаимодействия.',
        ],
      },
      {
        title: '4. Защита соединения',
        content: [
          'Все соединения осуществляются исключительно по защищённому протоколу HTTPS с валидными сертификатами шифрования TLS.',
        ],
      },
    ],
  },

  'contact': {
    id: 'contact',
    title: 'Контакты и поддержка',
    subtitle: 'Прямая связь с разработчиками и службой заботы NEST',
    lastUpdated: '8 октября 2026 г.',
    sections: [
      {
        title: '1. Поддержка пользователей',
        content: [
          'Если у вас возникли вопросы по работе платформы, настройке Дома или возникли технические сложности, напишите нам: support@nest.family.',
        ],
      },
      {
        title: '2. Вопросы приватности и защиты данных',
        content: [
          'Специализированный адрес по вопросам конфиденциальности, обработки данных и запросов на удаление: privacy@nest.family.',
        ],
      },
      {
        title: '3. Архитектурная команда NEST',
        content: [
          'NEST разрабатывается независимой группой инженеров и дизайнеров, стремящихся создать альтернативу шумным и навязчивым сервисам. Мы ценим ваши отзывы и пожелания по улучшению семейной системы.',
        ],
      },
    ],
  },
};

export const LEGAL_DOCS_EN: Record<LegalDocId, LegalDocument> = {
  'privacy-guarantee': {
    id: 'privacy-guarantee',
    title: 'Privacy & Data Protection Guarantee',
    subtitle: 'Official manifesto of the sovereign digital sanctuary NEST',
    lastUpdated: 'October 8, 2026',
    sections: [
      {
        title: '1. Core Principle: Your HOME belongs to you',
        content: [
          'NEST is designed from the ground up as a sovereign family operating system where privacy is not an afterthought, but a core architectural foundation.',
          'Our principle is straightforward: everything that happens inside your HOME — everyday tasks, academic assignments, private notes, files, and family photos — belongs exclusively to your household and will never be commodified.',
        ],
      },
      {
        title: '2. Zero Monetization of Personal Data',
        content: [
          'NEST does not sell, rent, license, or transfer personal data to advertising networks, data brokers, behavioral trackers, or third-party commercial entities.',
          'There are zero third-party advertising scripts, zero tracking pixels, and zero behavioral telemetry.',
        ],
      },
      {
        title: '3. What Data Is Stored and Why',
        content: [
          '• Profile: Display name, username (@handle), email address, and chosen avatar (predefined or uploaded photo). Needed strictly for authentication and task attribution.',
          '• HOME Spaces: HOME title, chosen atmosphere, generated invite codes, and member rosters with role assignments.',
          '• Task Records: Titles, descriptions, due dates, priority tiers, subjects, completion states, attachments, and discussions.',
          'All data is used exclusively to support seamless collaboration for your household.',
        ],
      },
      {
        title: '4. Who Can Access Your HOME Content',
        content: [
          'Access to your HOME is restricted exclusively to authenticated users who were explicitly invited by the owner or joined via your private invite code.',
          'There are no public profiles, no searchable directories, and zero indexing by search engines.',
        ],
      },
      {
        title: '5. Handling of Uploaded Photos and Files',
        content: [
          'Uploaded files (PDFs, worksheet scans, references) and personal photos are processed client-side via standard browser APIs.',
          'Files are never fed into machine learning pipelines, never scanned for advertising, and exist solely within the context of their respective task.',
        ],
      },
      {
        title: '6. Absolute User Control and Erasure Rights',
        content: [
          'You hold the absolute right to delete any task, attachment, comment, or entire HOME at any moment.',
          'When a HOME is deleted by its owner, all associated tasks and records are permanently removed.',
        ],
      },
      {
        title: '7. Direct Contact for Privacy Inquiries',
        content: [
          'For any privacy questions or data requests, you can contact our dedicated team directly at privacy@nest.family.',
        ],
      },
    ],
  },

  'privacy-policy': {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    subtitle: 'Terms governing collection, storage, and processing of information',
    lastUpdated: 'October 8, 2026',
    sections: [
      {
        title: '1. General Provisions',
        content: [
          'This Privacy Policy defines how NEST collects and protects user information.',
          'By using NEST, you agree to the collection and use of data strictly according to this document.',
        ],
      },
      {
        title: '2. Categories of Processed Data',
        content: [
          'We process only the absolute minimum required to deliver the platform:',
          '• Registration data: display name, username, email, encrypted credentials.',
          '• User content: tasks, comments, completions, avatars.',
          '• Session preferences: language choice, theme (Light/Dark), chosen atmosphere.',
        ],
      },
      {
        title: '3. Legal Basis for Processing',
        content: [
          'Data processing is grounded in user consent upon registration and necessity to perform the service agreement.',
        ],
      },
      {
        title: '4. Storage and Security',
        content: [
          'Session data is stored in the browser’s secure isolated storage (Web Storage API). Transmission occurs exclusively over encrypted TLS/HTTPS connections.',
        ],
      },
      {
        title: '5. User Rights',
        content: [
          'Users maintain the right to inspect their records, update profile data, or permanently delete their account and associated spaces.',
        ],
      },
    ],
  },

  'terms-of-service': {
    id: 'terms-of-service',
    title: 'Terms of Service',
    subtitle: 'Rules of interaction and mutual commitments',
    lastUpdated: 'October 8, 2026',
    sections: [
      {
        title: '1. Purpose of the Service',
        content: [
          'NEST is a digital sanctuary for organizing family tasks, academic assignments, and collaborative household cadence.',
          'Designed for private, personal, and non-commercial educational use.',
        ],
      },
      {
        title: '2. Accounts and Responsibilities',
        content: [
          'Users are responsible for safeguarding their login credentials and all activities occurring under their account.',
          'The HOME Owner manages invited participants and assigns roles (Owner, Parent, Member).',
        ],
      },
      {
        title: '3. Intellectual Property',
        content: [
          'All trademarks, visual identity, and software components belong to NEST creators.',
          'All user-generated content (task descriptions, solutions, notes, photos) remains 100% the property of the user.',
        ],
      },
      {
        title: '4. Acceptable Conduct',
        content: [
          'Users may not use NEST to disseminate malware, harass individuals, or violate third-party legal rights.',
        ],
      },
      {
        title: '5. Limitation of Liability',
        content: [
          'The service is provided on an "as is" basis with diligent care for reliability and data stability.',
        ],
      },
    ],
  },

  'cookie-policy': {
    id: 'cookie-policy',
    title: 'Cookie & Storage Policy',
    subtitle: 'Transparent disclosures regarding client-side state storage',
    lastUpdated: 'October 8, 2026',
    sections: [
      {
        title: '1. Zero Advertising or Tracking Cookies',
        content: [
          'NEST does not employ third-party advertising cookies, cross-site trackers, or commercial profiling beacons.',
        ],
      },
      {
        title: '2. Essential Local Storage Usage',
        content: [
          'Instead of invasive cookies, NEST utilizes standard browser Web Storage (LocalStorage) strictly for core technical operations:',
          '• Preserving active user authentication session;',
          '• Remembering interface theme (Warm Paper / Midnight);',
          '• Remembering language preference (Russian / English);',
          '• Preserving selected atmosphere (Midnight, Clouds, Sunset, Ocean, Aurora).',
        ],
      },
      {
        title: '3. Managing Local State',
        content: [
          'You may clear your browser’s local storage at any time via browser settings without harming your device.',
        ],
      },
    ],
  },

  'data-deletion': {
    id: 'data-deletion',
    title: 'Data Deletion Policy',
    subtitle: 'Procedure for permanent and irrevocable erasure of information',
    lastUpdated: 'October 8, 2026',
    sections: [
      {
        title: '1. Right to Erasure',
        content: [
          'Every NEST citizen has the uncompromised right to permanently delete their personal data and associated records.',
        ],
      },
      {
        title: '2. Granular Deletion',
        content: [
          '• Tasks: Can be deleted by their creator, parents, or home owner within the task card.',
          '• Comments & Files: Can be deleted directly within task threads.',
          '• Members: Can be removed by the owner in the Members directory.',
        ],
      },
      {
        title: '3. Complete HOME Deletion',
        content: [
          'A HOME Owner may delete an entire HOME in Settings → Home Settings → Danger Zone. Upon confirmation, all tasks, history, and participant links are permanently purged.',
        ],
      },
      {
        title: '4. Session Clearing',
        content: [
          'Signing out clears the active local session on the current browser immediately.',
        ],
      },
    ],
  },

  'security': {
    id: 'security',
    title: 'Security Architecture',
    subtitle: 'Principles of isolation and protection of family sanctuaries',
    lastUpdated: 'October 8, 2026',
    sections: [
      {
        title: '1. Space Isolation',
        content: [
          'Each HOME in NEST operates within an isolated sandbox. Non-members cannot view tasks, members, or chronicles of other HOMEs.',
        ],
      },
      {
        title: '2. Cryptographic Invite Codes',
        content: [
          'Entry into a HOME requires a distinct 6-character code. Owners can regenerate codes or revoke member access instantly.',
        ],
      },
      {
        title: '3. Role-Based Access Control (RBAC)',
        content: [
          '• Owner: Full administrative oversight over HOME, atmosphere, and access.',
          '• Parent: Task creation, assignment, verification, and revision requests.',
          '• Member: Focus on personal assigned work, completion submission, discussion.',
        ],
      },
      {
        title: '4. Transport Security',
        content: [
          'All communications are encrypted using current TLS/HTTPS protocols.',
        ],
      },
    ],
  },

  'contact': {
    id: 'contact',
    title: 'Contact & Support',
    subtitle: 'Direct communication channels with the NEST stewardship team',
    lastUpdated: 'October 8, 2026',
    sections: [
      {
        title: '1. User Support',
        content: [
          'For questions regarding HOME setup, features, or troubleshooting, contact support@nest.family.',
        ],
      },
      {
        title: '2. Privacy & Compliance',
        content: [
          'For privacy matters and erasure requests: privacy@nest.family.',
        ],
      },
      {
        title: '3. Architectural Team',
        content: [
          'NEST is crafted by independent engineers and designers committed to quiet, respectful software. We welcome your feedback.',
        ],
      },
    ],
  },
};
