const STORAGE_KEYS = {
  employees: 'dienstplan_employees',
  services: 'dienstplan_services',
  functions: 'dienstplan_functions',
  employmentTypes: 'dienstplan_employment_types',
  rules: 'dienstplan_rules',
  assignments: 'dienstplan_assignments',
  locks: 'dienstplan_locks',
  groups: 'dienstplan_groups',
  layout: 'dienstplan_layout',
  logs: 'dienstplan_logs',
  vacationLimits: 'dienstplan_vacation_limits',
  tickets: 'dienstplan_tickets',
};

const STORAGE_FILE_NAME = 'dienstplan_daten.json';
const THEME_STORAGE_KEY = 'dienstplan_theme';
const AREAS = ['Technik', 'Leitung', 'Ausbildung'];

const USERS = {
  '05475': { password: '1234', name: 'Admin', permissions: { roster: 'write', tickets: 'edit', admin: true } },
  '012345': { password: '4321', name: 'Leser', permissions: { roster: 'read', tickets: 'create', admin: false } },
};

const uuid = () => {
  const hasCrypto = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function';
  return hasCrypto ? crypto.randomUUID() : `id-${Math.random().toString(16).slice(2)}-${Date.now()}`;
};

function generateTicketNumber() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const timePart = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  return `T-${datePart}-${timePart}-${Math.random().toString(16).slice(2, 6).toUpperCase()}`;
}

const clone = (value) =>
  typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));

const DEFAULT_EMPLOYMENT = [
  { id: uuid(), percent: 100, hours: 173 },
  { id: uuid(), percent: 80, hours: 138 },
  { id: uuid(), percent: 50, hours: 86 },
];

const DEFAULT_SERVICES = [
  { id: uuid(), name: 'NCN', start: '19:00', end: '07:00', isNight: true },
  { id: uuid(), name: 'NdN', start: '19:00', end: '07:00', isNight: true },
  { id: uuid(), name: 'ND1', start: '07:00', end: '19:00', isNight: false },
  { id: uuid(), name: 'C1', start: '07:00', end: '19:00', isNight: false },
];

const DEFAULT_FUNCTIONS = (services) => [
  {
    id: uuid(),
    name: 'Disponent*in',
    serviceIds: services.filter((s) => s.name.toLowerCase().includes('d')).map((s) => s.id),
    status: 'active',
  },
  { id: uuid(), name: 'Calltaker', serviceIds: services.filter((s) => s.name.toLowerCase().includes('c')).map((s) => s.id), status: 'active' },
];

const VACATION_TYPES = {
  vacation: { label: 'U', name: 'Urlaub', clearsAssignments: true, usesDailyHours: true, requiresReason: false, showService: false },
  special: {
    label: 'SU',
    name: 'Sonderurlaub',
    clearsAssignments: true,
    usesDailyHours: true,
    requiresReason: true,
    showService: false,
  },
  special2: {
    label: 'SU2',
    name: 'Sonderurlaub 2',
    clearsAssignments: false,
    usesDailyHours: false,
    requiresReason: true,
    showService: true,
  },
};

const SICK_TYPES = {
  sick: { label: 'K', name: 'Krankenstand', clearsAssignments: true, usesDailyHours: true, showService: false },
  care: { label: 'P', name: 'Pflegeurlaub', clearsAssignments: true, usesDailyHours: true, showService: false },
  care2: { label: 'P2', name: 'Pflegeurlaub 2', clearsAssignments: false, usesDailyHours: false, showService: true },
};

const DEFAULT_EMPLOYEES = (employment, functions) => [
  {
    id: uuid(),
    firstName: 'Alex',
    lastName: 'Huber',
    personnelNumber: '1001',
    birthday: '1988-05-12',
    email: 'alex.huber@example.com',
    employmentPercent: employment[0].id,
    employmentHours: employment[0].id,
    functionId: functions[0].id,
    vacationDays: 25,
    vacations: [],
    sickLeaves: [],
    groupId: null,
    nightAllowed: true,
    rkt: false,
    holidayFactor: 0,
    dailyWorkHours: 8,
    hireDate: '2023-01-01',
    endDate: '',
    doubleNights: false,
    rosterPermission: 'write',
    ticketPermission: 'edit',
    status: 'active',
  },
  {
    id: uuid(),
    firstName: 'Bianca',
    lastName: 'Mayr',
    personnelNumber: '1002',
    birthday: '1990-09-02',
    email: 'bianca.mayr@example.com',
    employmentPercent: employment[1].id,
    employmentHours: employment[1].id,
    functionId: functions[1].id,
    vacationDays: 25,
    vacations: [],
    sickLeaves: [],
    groupId: null,
    nightAllowed: true,
    rkt: true,
    holidayFactor: 0,
    dailyWorkHours: 8,
    hireDate: '2023-01-01',
    endDate: '',
    doubleNights: false,
    rosterPermission: 'write',
    ticketPermission: 'edit',
    status: 'active',
  },
  {
    id: uuid(),
    firstName: 'Chris',
    lastName: 'Lenz',
    personnelNumber: '1003',
    birthday: '1992-03-21',
    email: 'chris.lenz@example.com',
    employmentPercent: employment[2].id,
    employmentHours: employment[2].id,
    functionId: functions[0].id,
    vacationDays: 25,
    vacations: [],
    sickLeaves: [],
    groupId: null,
    nightAllowed: false,
    rkt: false,
    holidayFactor: 0,
    dailyWorkHours: 8,
    hireDate: '2023-01-01',
    endDate: '',
    doubleNights: false,
    rosterPermission: 'write',
    ticketPermission: 'edit',
    status: 'active',
  },
  {
    id: uuid(),
    firstName: 'Alois',
    lastName: 'Reichsöllner',
    personnelNumber: '1004',
    birthday: '1985-11-03',
    email: 'alois.reichsoellner@example.com',
    employmentPercent: employment[0].id,
    employmentHours: employment[0].id,
    functionId: functions[0].id,
    vacationDays: 25,
    vacations: [],
    sickLeaves: [],
    groupId: null,
    nightAllowed: true,
    rkt: false,
    holidayFactor: 0,
    dailyWorkHours: 8,
    hireDate: '2023-01-01',
    endDate: '',
    doubleNights: false,
    rosterPermission: 'write',
    ticketPermission: 'edit',
    status: 'active',
  },
];

const DEFAULT_LOGS = {
  roster: [],
  employees: [],
  services: [],
  functions: [],
  employment: [],
  rules: [],
  vacationLimits: [],
  tickets: [],
};

const defaultWeekdayServices = () => ({
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  holiday: [],
});

const createWeekdayRule = (overrides = {}) => ({
  id: uuid(),
  start: '',
  end: '',
  services: defaultWeekdayServices(),
  ...overrides,
});

const DEFAULT_RULES = {
  restAfterNight: 1,
  restAfterDoubleNight: 2,
  maxHoursWeek: 40,
  minFreeWeekends: 0,
  maxNights: 8,
  vacationDefault: 2,
  weekdayRules: [createWeekdayRule()],
};

const TICKET_STATUSES = ['Offen', 'in Bearbeitung', 'Zurückgestellt', 'Geschlossen'];
const TICKET_PRIORITIES = ['hoch', 'mittel', 'gering'];

const SALZBURG_HOLIDAYS = {
  // month-day: label
  '01-01': 'Neujahr',
  '01-06': 'Heilige Drei Könige',
  '04-10': 'Ostermontag',
  '05-01': 'Staatsfeiertag',
  '05-18': 'Christi Himmelfahrt',
  '05-29': 'Pfingstmontag',
  '06-08': 'Fronleichnam',
  '08-15': 'Mariä Himmelfahrt',
  '10-26': 'Nationalfeiertag',
  '11-01': 'Allerheiligen',
  '12-08': 'Maria Empfängnis',
  '12-25': 'Christtag',
  '12-26': 'Stefanitag',
};

const WEEKDAY_KEYS = ['1', '2', '3', '4', '5', '6', '0', 'holiday'];
const WEEKDAY_LABELS = {
  0: 'Sonntag',
  1: 'Montag',
  2: 'Dienstag',
  3: 'Mittwoch',
  4: 'Donnerstag',
  5: 'Freitag',
  6: 'Samstag',
  holiday: 'Feiertage',
};

const menuButtons = document.querySelectorAll('.main-menu button[data-target]');
const screens = document.querySelectorAll('[data-screen]');
const employeeForm = document.getElementById('employeeForm');
const serviceForm = document.getElementById('serviceForm');
const functionForm = document.getElementById('functionForm');
const employmentForm = document.getElementById('employmentForm');
const rulesForm = document.getElementById('rulesForm');
const employeeList = document.getElementById('employeeList');
const serviceList = document.getElementById('serviceList');
const functionList = document.getElementById('functionList');
const employmentList = document.getElementById('employmentList');
const rulesSummary = document.getElementById('rulesSummary');
const functionSelect = document.getElementById('functionSelect');
const functionServices = document.getElementById('functionServices');
const employmentPercentSelect = document.getElementById('employmentPercentSelect');
const employmentHoursSelect = document.getElementById('employmentHoursSelect');
const employeePicker = document.getElementById('employeePicker');
const servicePicker = document.getElementById('servicePicker');
const functionPicker = document.getElementById('functionPicker');
const employmentPicker = document.getElementById('employmentPicker');
const rosterPanel = document.querySelector('[data-screen="roster"]');
const rosterTable = document.getElementById('rosterTable');
const monthLabel = document.getElementById('monthLabel');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const generateBtn = document.getElementById('generatePlan');
const printPlanBtn = document.getElementById('printPlan');
const clearBtn = document.getElementById('clearPlan');
const appShell = document.getElementById('appShell');
const saveFileBtn = document.getElementById('saveFile');
const loadFileBtn = document.getElementById('loadFile');
const loadFileInput = document.getElementById('loadFileInput');
const employeeExitBtn = document.getElementById('employeeExitBtn');
const notificationStack = document.getElementById('notificationStack');
const weekdaySelects = document.querySelectorAll('[data-weekday-select]');
const weekdayFields = document.querySelectorAll('[data-weekday-field]');
const createGroupBtn = document.getElementById('createGroupBtn');
const assignGroupBtn = document.getElementById('assignGroupBtn');
const removeGroupBtn = document.getElementById('removeGroupBtn');
const groupSelect = document.getElementById('groupSelect');
const rowToolsMenu = document.getElementById('rowToolsMenu');
const vacationPanel = document.getElementById('vacationPanel');
const vacationBalance = document.getElementById('vacationBalance');
const vacationStartInput = document.getElementById('vacationStart');
const vacationEndInput = document.getElementById('vacationEnd');
const addVacationBtn = document.getElementById('addVacation');
const vacationList = document.getElementById('vacationList');
const vacationTypeSelect = document.getElementById('vacationType');
const vacationReasonInput = document.getElementById('vacationReason');
const vacationReasonWrapper = document.getElementById('vacationReasonWrapper');
const sickPanel = document.getElementById('sickPanel');
const sickStartInput = document.getElementById('sickStart');
const sickEndInput = document.getElementById('sickEnd');
const addSickBtn = document.getElementById('addSick');
const sickList = document.getElementById('sickList');
const sickTypeSelect = document.getElementById('sickType');
const rosterModeButtons = document.querySelectorAll('[data-roster-mode]');
const serviceLegend = document.getElementById('serviceLegend');
const themeToggle = document.getElementById('themeToggle');
const loginForm = document.getElementById('loginForm');
const loginUser = document.getElementById('loginUser');
const loginPassword = document.getElementById('loginPassword');
const loginStatus = document.getElementById('loginStatus');
const logoutBtn = document.getElementById('logoutBtn');
const openSickList = document.getElementById('openSickList');
const vacationLimitForm = document.getElementById('vacationLimitForm');
const vacationLimitStart = document.getElementById('vacationLimitStart');
const vacationLimitEnd = document.getElementById('vacationLimitEnd');
const vacationLimitValue = document.getElementById('vacationLimitValue');
const vacationLimitList = document.getElementById('vacationLimitList');
const vacationDefaultInput = document.getElementById('vacationDefault');
const weekdayRangeStart = document.getElementById('weekdayRangeStart');
const weekdayRangeEnd = document.getElementById('weekdayRangeEnd');
const weekdayHistory = document.getElementById('weekdayHistory');
const menuEmployeeAlert = document.getElementById('menuEmployeeAlert');
const openSickIndicator = document.getElementById('openSickIndicator');
const ticketForm = document.getElementById('ticketForm');
const ticketNameInput = document.getElementById('ticketName');
const ticketPriorityInput = document.getElementById('ticketPriority');
const ticketDescriptionInput = document.getElementById('ticketDescription');
const ticketReporterInput = document.getElementById('ticketReporter');
const ticketReporterEmailInput = document.getElementById('ticketReporterEmail');
const ticketAreaInput = document.getElementById('ticketArea');
const ticketStatusFilter = document.getElementById('ticketStatusFilter');
const ticketList = document.getElementById('ticketList');
const rulesLog = document.getElementById('rulesLog');
const employmentLog = document.getElementById('employmentLog');
const servicesLog = document.getElementById('servicesLog');
const functionsLog = document.getElementById('functionsLog');
const employeeAreasSelect = document.getElementById('employeeAreas');
const logElements = {
  roster: document.getElementById('rosterLog'),
  rules: rulesLog,
  employment: employmentLog,
  services: servicesLog,
  functions: functionsLog,
};

let state = loadState();
state.vacationLimits = Array.isArray(state.vacationLimits) ? state.vacationLimits : [];
let currentMonth = new Date();
currentMonth.setDate(1);
const editing = { employee: null, service: null, function: null, employment: null };
let weekdaySelections = ensureWeekdaySelections(currentWeekdayRule()?.services || {}, state.services);
let selectedRows = new Set();
let draggingRowId = null;
let rosterMode = 'edit';
let modeBeforePrint = null;
let currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
let editingWeekdayRuleId = currentWeekdayRule()?.id || null;
let currentUser = null;

function loadState() {
  const employment = loadArray(STORAGE_KEYS.employmentTypes, DEFAULT_EMPLOYMENT);
  const services = loadArray(STORAGE_KEYS.services, DEFAULT_SERVICES);
  const functions = normalizeFunctions(loadArray(STORAGE_KEYS.functions, DEFAULT_FUNCTIONS(services)), services);
  const employeesRaw = loadArray(STORAGE_KEYS.employees, DEFAULT_EMPLOYEES(employment, functions));
  const normalizeEmployeeEntry = (emp) => {
    const areas = Array.isArray(emp.areas) ? emp.areas.filter((a) => AREAS.includes(a)) : [];
    return {
      ...emp,
      areas,
      admin: !!emp.admin,
      rosterPermission: emp.rosterPermission || 'write',
      ticketPermission: emp.ticketPermission || 'edit',
    };
  };
  const employeesWithDefaults = employeesRaw.map(normalizeEmployeeEntry);
  const ensureTestUser = (personnelNumber, extra = {}) => {
    if (employeesWithDefaults.some((e) => e.personnelNumber === personnelNumber)) return;
    employeesWithDefaults.push(
      normalizeEmployeeEntry({
        id: uuid(),
        firstName: extra.firstName || 'Test',
        lastName: extra.lastName || personnelNumber,
        personnelNumber,
        email: extra.email || '',
        birthday: '1990-01-01',
        employmentPercent: employment[0]?.id,
        employmentHours: employment[0]?.id,
        functionId: functions[0]?.id,
        vacationDays: 25,
        vacations: [],
        sickLeaves: [],
        groupId: null,
        nightAllowed: true,
        rkt: false,
        holidayFactor: 0,
        dailyWorkHours: 8,
        hireDate: '2023-01-01',
        endDate: '',
        doubleNights: false,
        rosterPermission: extra.rosterPermission || 'write',
        ticketPermission: extra.ticketPermission || 'edit',
        status: 'active',
        admin: !!extra.admin,
        areas: extra.areas || AREAS,
      })
    );
  };
  ensureTestUser('05475', {
    firstName: 'Alois',
    lastName: 'Reichsöllner',
    admin: true,
    ticketPermission: 'edit',
    rosterPermission: 'write',
    areas: AREAS,
  });
  ensureTestUser('012345', {
    firstName: 'Hans',
    lastName: 'Maier',
    rosterPermission: 'read',
    ticketPermission: 'create',
    admin: false,
    areas: ['Technik', 'Ausbildung'],
  });
  const storedRules = loadValue(STORAGE_KEYS.rules, DEFAULT_RULES);
  const rules = {
    ...DEFAULT_RULES,
    ...storedRules,
  };
  rules.minFreeWeekends =
    storedRules?.minFreeWeekends ?? storedRules?.maxWeekendDays ?? DEFAULT_RULES.minFreeWeekends;
  rules.restAfterNight = Number.isFinite(Number(rules.restAfterNight))
    ? Number(rules.restAfterNight)
    : DEFAULT_RULES.restAfterNight;
  rules.restAfterDoubleNight = Number.isFinite(Number(rules.restAfterDoubleNight))
    ? Number(rules.restAfterDoubleNight)
    : DEFAULT_RULES.restAfterDoubleNight;
  rules.weekdayRules = normalizeWeekdayRules(storedRules, services);
  rules.vacationDefault = Number.isFinite(Number(rules.vacationDefault))
    ? Number(rules.vacationDefault)
    : DEFAULT_RULES.vacationDefault;
  const assignments = loadValue(STORAGE_KEYS.assignments, {});
  const locks = loadValue(STORAGE_KEYS.locks, {});
  const groups = loadArray(STORAGE_KEYS.groups, []);
  const sanitizedGroups = sanitizeGroups(groups);
  const employees = normalizeEmployees(employeesWithDefaults, sanitizedGroups);
  const layout = ensureLayout(loadValue(STORAGE_KEYS.layout, null), employees);
  const logs = ensureLogs(loadValue(STORAGE_KEYS.logs, DEFAULT_LOGS));
  const vacationLimits = normalizeVacationLimits(loadValue(STORAGE_KEYS.vacationLimits, []));
  const tickets = normalizeTickets(loadArray(STORAGE_KEYS.tickets, []));
  cleanEmployeeGroups(employees, sanitizedGroups);
  return {
    employment,
    services,
    functions,
    employees,
    rules,
    assignments,
    locks,
    groups: sanitizedGroups,
    layout,
    logs,
    vacationLimits,
    tickets,
  };
}

function loadArray(key, fallback) {
  return loadFromStorage(key, fallback, Array.isArray);
}

function loadValue(key, fallback) {
  return loadFromStorage(key, fallback);
}

function loadFromStorage(key, fallback, validate = () => true) {
  const defaultValue = clone(fallback);
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    const parsed = JSON.parse(raw);
    if (validate(parsed)) return parsed;
    console.warn('Ungültiges Format, verwende Fallback', key);
  } catch (error) {
    console.warn('Konnte Daten nicht laden, verwende Fallback', key, error);
  }
  localStorage.setItem(key, JSON.stringify(defaultValue));
  return defaultValue;
}

function sanitizeGroups(groups = []) {
  if (!Array.isArray(groups)) return [];
  return groups
    .map((group) => {
      if (!group || !group.id) return null;
      return { id: group.id, name: group.name || 'Gruppe' };
    })
    .filter(Boolean);
}

function normalizeFunctions(functions = [], services = []) {
  if (!Array.isArray(functions)) return [];
  const serviceIds = new Set(services.map((s) => s.id));
  return functions
    .map((entry) => {
      if (!entry || !entry.id) return null;
      return {
        id: entry.id,
        name: entry.name || 'Funktion',
        serviceIds: Array.isArray(entry.serviceIds)
          ? entry.serviceIds.filter((id) => serviceIds.has(id))
          : [],
        status: entry.status === 'removed' ? 'removed' : 'active',
      };
    })
    .filter(Boolean);
}

function normalizeEmployees(employees = [], groups = []) {
  return employees.map((emp) => {
    const vacationDays = Number(emp.vacationDays);
    const holidayFactor = parseDecimalInput(emp.holidayFactor, 0);
    const dailyWorkHours = parseDecimalInput(emp.dailyWorkHours, 0);
    const hireDate = parseISODate(emp.hireDate) ? emp.hireDate : '';
    const endDate = parseISODate(emp.endDate) ? emp.endDate : '';
    const status = emp.status === 'exited' ? 'exited' : 'active';
    const rosterPermission = ['write', 'read'].includes(emp.rosterPermission) ? emp.rosterPermission : 'write';
    const ticketPermission = ['write', 'edit'].includes(emp.ticketPermission) ? emp.ticketPermission : 'edit';
    const normalized = {
      ...emp,
      vacationDays: Number.isFinite(vacationDays) ? vacationDays : 0,
      vacations: normalizeVacationEntries(emp.vacations),
      sickLeaves: normalizeSickEntries(emp.sickLeaves),
      email: typeof emp.email === 'string' ? emp.email : '',
      holidayFactor: Number.isFinite(holidayFactor) ? holidayFactor : 0,
      dailyWorkHours: Number.isFinite(dailyWorkHours) ? dailyWorkHours : 0,
      groupId: emp.groupId && groups.some((g) => g.id === emp.groupId) ? emp.groupId : null,
      hireDate,
      endDate,
      doubleNights: !!emp.doubleNights,
      status,
      rosterPermission,
      ticketPermission,
    };
    return normalized;
  });
}

function normalizeTickets(tickets = []) {
  if (!Array.isArray(tickets)) return [];
  return tickets
    .map((ticket) => {
      if (!ticket || !ticket.name) return null;
      const status = TICKET_STATUSES.includes(ticket.status) ? ticket.status : TICKET_STATUSES[0];
      const priority = TICKET_PRIORITIES.includes(ticket.priority) ? ticket.priority : TICKET_PRIORITIES[1];
      const area = AREAS.includes(ticket.area) ? ticket.area : AREAS[0];
      return {
        id: ticket.id || uuid(),
        ticketNumber: ticket.ticketNumber || generateTicketNumber(),
        name: ticket.name,
        priority,
        area,
        description: ticket.description || '',
        status,
        reporterName: ticket.reporterName || 'Alois Reichsöllner',
        reporterEmail: typeof ticket.reporterEmail === 'string' ? ticket.reporterEmail : '',
        createdAt: parseISODate(ticket.createdAt) ? ticket.createdAt : new Date().toISOString(),
        assignee: ticket.assignee || '',
        updates: Array.isArray(ticket.updates)
          ? ticket.updates
              .map((entry) => {
                if (!entry) return null;
                return {
                  id: entry.id || uuid(),
                  note: typeof entry.note === 'string' ? entry.note : '',
                  status: TICKET_STATUSES.includes(entry.status) ? entry.status : status,
                  timestamp: parseISODate(entry.timestamp)
                    ? entry.timestamp
                    : new Date(entry.timestamp || Date.now()).toISOString(),
                  notify: !!entry.notify,
                };
              })
              .filter(Boolean)
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          : [],
      };
    })
    .filter(Boolean);
}

function sanitizeDateValue(value) {
  const date = parseISODate(value);
  return date ? formatISODate(date) : '';
}

function normalizeWeekdayRules(rawRules = {}, services = []) {
  const list = Array.isArray(rawRules?.weekdayRules) && rawRules.weekdayRules.length
    ? rawRules.weekdayRules
    : [{ services: rawRules?.weekdayServices || defaultWeekdayServices(), start: '', end: '' }];
  const normalized = list
    .map((entry) => ({
      id: entry.id || uuid(),
      start: sanitizeDateValue(entry.start),
      end: sanitizeDateValue(entry.end),
      services: ensureWeekdaySelections(entry.services || {}, services),
    }))
    .filter((entry) => !!entry);
  return normalized.length ? normalized : [createWeekdayRule({ services: ensureWeekdaySelections({}, services) })];
}

function normalizeVacationLimits(raw) {
  if (Array.isArray(raw)) {
    return raw
      .map((entry) => {
        const start = sanitizeDateValue(entry.start);
        const end = sanitizeDateValue(entry.end || entry.start);
        const limit = Number(entry.limit);
        if (!start || !Number.isFinite(limit)) return null;
        return { id: entry.id || uuid(), start, end: end || start, limit };
      })
      .filter(Boolean)
      .sort((a, b) => a.start.localeCompare(b.start));
  }
  if (raw && typeof raw === 'object') {
    return Object.entries(raw)
      .map(([dateStr, value]) => {
        const start = sanitizeDateValue(dateStr);
        const limit = Number(value);
        if (!start || !Number.isFinite(limit)) return null;
        return { id: uuid(), start, end: start, limit };
      })
      .filter(Boolean)
      .sort((a, b) => a.start.localeCompare(b.start));
  }
  return [];
}

function normalizeVacationEntries(entries = []) {
  if (!Array.isArray(entries)) return [];
  return entries
    .map((entry) => {
      const start = parseISODate(entry?.start);
      const end = parseISODate(entry?.end);
      if (!start || !end) return null;
      const ordered = start <= end ? { start, end } : { start: end, end: start };
      return {
        id: entry.id || uuid(),
        start: formatISODate(ordered.start),
        end: formatISODate(ordered.end),
        type: VACATION_TYPES[entry?.type] ? entry.type : 'vacation',
        reason: typeof entry?.reason === 'string' ? entry.reason : '',
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.start.localeCompare(b.start));
}

function normalizeSickEntries(entries = []) {
  if (!Array.isArray(entries)) return [];
  return entries
    .map((entry) => {
      const start = parseISODate(entry?.start);
      const end = parseISODate(entry?.end);
      if (!start || !end) return null;
      const ordered = start <= end ? { start, end } : { start: end, end: start };
      return {
        id: entry.id || uuid(),
        start: formatISODate(ordered.start),
        end: formatISODate(ordered.end),
        confirmed: !!entry.confirmed,
        kind: SICK_TYPES[entry?.kind] ? entry.kind : 'sick',
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.start.localeCompare(b.start));
}

function ensureLayout(layout, employees) {
  const ids = employees.map((emp) => emp.id);
  if (!layout || !Array.isArray(layout.order)) {
    return { order: ids.slice(), generatorPivot: 0 };
  }
  const order = layout.order.filter((id) => ids.includes(id));
  ids.forEach((id) => {
    if (!order.includes(id)) order.push(id);
  });
  const generatorPivot = Number.isFinite(layout.generatorPivot) ? layout.generatorPivot : 0;
  return { order, generatorPivot };
}

function ensureLogs(logs = DEFAULT_LOGS) {
  const target = {};
  Object.keys(DEFAULT_LOGS).forEach((key) => {
    const list = Array.isArray(logs?.[key]) ? logs[key] : [];
    target[key] = list
      .filter((entry) => entry && typeof entry.message === 'string')
      .map((entry) => ({
        id: entry.id || uuid(),
        message: entry.message,
        timestamp: Number(entry.timestamp) || Date.now(),
        entityId: entry.entityId || null,
      }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 200);
  });
  return target;
}

function cleanEmployeeGroups(employees, groups) {
  const valid = new Set(groups.map((g) => g.id));
  employees.forEach((emp) => {
    if (emp.groupId && !valid.has(emp.groupId)) {
      emp.groupId = null;
    }
  });
}

function updateExitedEmployees(autoSave = true) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let changed = false;
  state.employees.forEach((emp) => {
    const exitDate = parseISODate(emp.endDate);
    const shouldExit = emp.status === 'exited' || (exitDate && exitDate <= today);
    if (shouldExit && emp.status !== 'exited') {
      emp.status = 'exited';
      changed = true;
    }
  });
  if (changed && autoSave) saveState();
  return changed;
}

function ensureEmployeeInLayout(empId) {
  if (!state.layout.order.includes(empId)) {
    state.layout.order.push(empId);
  }
}

function getOrderedEmployees() {
  const order = state.layout?.order || [];
  const map = new Map(state.employees.map((emp) => [emp.id, emp]));
  const result = [];
  order.forEach((id) => {
    if (map.has(id)) result.push(map.get(id));
  });
  state.employees.forEach((emp) => {
    if (!order.includes(emp.id)) {
      ensureEmployeeInLayout(emp.id);
      result.push(emp);
    }
  });
  return result;
}

function cleanSelectedRows() {
  const ids = new Set(state.employees.map((emp) => emp.id));
  selectedRows.forEach((id) => {
    if (!ids.has(id)) selectedRows.delete(id);
  });
}

function updateGroupPicker() {
  if (!groupSelect) return;
  const previous = groupSelect.value;
  const options = state.groups
    .map((group) => `<option value="${group.id}">${group.name}</option>`)
    .join('');
  groupSelect.innerHTML = '<option value="">Gruppe wählen…</option>' + options;
  if (previous && state.groups.some((g) => g.id === previous)) {
    groupSelect.value = previous;
  }
}

function selectedRowsHaveGroup() {
  return Array.from(selectedRows).some((id) => {
    const emp = state.employees.find((e) => e.id === id);
    return !!emp?.groupId;
  });
}

function updateRowToolStates() {
  if (!createGroupBtn) return;
  const hasSelection = selectedRows.size > 0;
  createGroupBtn.disabled = !hasSelection;
  assignGroupBtn.disabled = !hasSelection || !groupSelect.value;
  removeGroupBtn.disabled = !hasSelection || !selectedRowsHaveGroup();
  if (rowToolsMenu) {
    if (hasSelection) {
      rowToolsMenu.removeAttribute('hidden');
    } else {
      rowToolsMenu.setAttribute('hidden', '');
    }
  }
}

function saveState() {
  const storageEntries = {
    [STORAGE_KEYS.employees]: state.employees,
    [STORAGE_KEYS.services]: state.services,
    [STORAGE_KEYS.functions]: state.functions,
    [STORAGE_KEYS.employmentTypes]: state.employment,
    [STORAGE_KEYS.rules]: state.rules,
    [STORAGE_KEYS.assignments]: state.assignments,
    [STORAGE_KEYS.locks]: state.locks,
    [STORAGE_KEYS.groups]: state.groups,
    [STORAGE_KEYS.layout]: state.layout,
    [STORAGE_KEYS.logs]: state.logs,
    [STORAGE_KEYS.vacationLimits]: state.vacationLimits,
    [STORAGE_KEYS.tickets]: state.tickets,
  };

  Object.entries(storageEntries).forEach(([key, value]) => {
    localStorage.setItem(key, JSON.stringify(value));
  });
}

function downloadStateFile() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = STORAGE_FILE_NAME;
  a.click();
  URL.revokeObjectURL(url);
}

function importState(json) {
  try {
    const parsed = JSON.parse(json);
    const parsedGroups = sanitizeGroups(parsed.groups ?? []);
    const employees = normalizeEmployees(parsed.employees ?? [], parsedGroups);
    const services = parsed.services ?? [];
    const parsedRules = parsed.rules || {};
    const functions = normalizeFunctions(parsed.functions ?? [], services);
    const rules = {
      ...DEFAULT_RULES,
      ...parsedRules,
    };
    rules.minFreeWeekends =
      parsedRules.minFreeWeekends ?? parsedRules.maxWeekendDays ?? DEFAULT_RULES.minFreeWeekends;
    rules.restAfterNight = Number.isFinite(Number(rules.restAfterNight))
      ? Number(rules.restAfterNight)
      : DEFAULT_RULES.restAfterNight;
    rules.restAfterDoubleNight = Number.isFinite(Number(rules.restAfterDoubleNight))
      ? Number(rules.restAfterDoubleNight)
      : DEFAULT_RULES.restAfterDoubleNight;
    rules.weekdayRules = normalizeWeekdayRules(parsedRules, services);
    rules.vacationDefault = Number.isFinite(Number(rules.vacationDefault))
      ? Number(rules.vacationDefault)
      : DEFAULT_RULES.vacationDefault;
    const tickets = normalizeTickets(parsed.tickets ?? []);
    state = {
      employees,
      services,
      functions,
      employment: parsed.employment ?? [],
      rules,
      assignments: parsed.assignments ?? {},
      locks: parsed.locks ?? {},
      groups: parsedGroups,
      layout: ensureLayout(parsed.layout, employees),
      logs: ensureLogs(parsed.logs ?? DEFAULT_LOGS),
      vacationLimits: normalizeVacationLimits(parsed.vacationLimits),
      tickets,
    };
    weekdaySelections = ensureWeekdaySelections(currentWeekdayRule()?.services || {}, state.services);
    editingWeekdayRuleId = currentWeekdayRule()?.id || null;
    cleanEmployeeGroups(state.employees, state.groups);
    updateExitedEmployees(false);
    editing.employee = null;
    editing.service = null;
    editing.function = null;
    editing.employment = null;
    selectedRows = new Set();
    employeeForm.reset();
    serviceForm.reset();
    functionForm.reset();
    employmentForm.reset();
    renderVacationPanel(null);
    renderSickPanel(null);
    saveState();
    updateDropdowns();
    renderEmployees();
    renderServices();
    renderFunctions();
    renderEmployment();
    renderRules();
    renderRoster();
    renderLogs();
  } catch (e) {
    alert('Konnte Datei nicht laden. Bitte prüfen, ob es eine gültige JSON-Datei ist.');
    console.error(e);
  }
}

function formatName(emp) {
  return `${emp.firstName} ${emp.lastName}`;
}

function formatLogTimestamp(ts) {
  const date = new Date(ts);
  return date.toLocaleString('de-AT', { dateStyle: 'short', timeStyle: 'short' });
}

function appendLog(section, message, entityId) {
  if (!state.logs[section]) state.logs[section] = [];
  state.logs[section].unshift({ id: uuid(), message, timestamp: Date.now(), entityId: entityId || null });
  state.logs[section] = state.logs[section].slice(0, 200);
  renderLogs(section);
}

function renderLogs(section) {
  const sections = section ? [section] : Object.keys(logElements);
  sections.forEach((key) => {
    const target = logElements[key];
    if (!target) return;
    const entries = state.logs?.[key] || [];
    if (!entries.length) {
      target.innerHTML = '<li class="muted">Noch keine Einträge</li>';
      return;
    }
    target.innerHTML = entries
      .map((entry) => `<li><strong>${formatLogTimestamp(entry.timestamp)}</strong><span>${entry.message}</span></li>`)
      .join('');
  });
}

function logsFor(section, entityId) {
  const entries = state.logs?.[section] || [];
  if (!entityId) return entries;
  return entries.filter((entry) => entry.entityId === entityId);
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function monthKeyToDate(key) {
  if (typeof key !== 'string') return null;
  const [yearStr, monthStr] = key.split('-');
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1;
  if (!Number.isFinite(year) || !Number.isFinite(monthIndex)) return null;
  return new Date(year, monthIndex, 1);
}

function parseISODate(value) {
  if (!value || typeof value !== 'string') return null;
  const [year, month, day] = value.split('-').map(Number);
  if (![year, month, day].every((num) => Number.isFinite(num))) return null;
  return new Date(year, month - 1, day);
}

function formatISODate(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function parseDecimalInput(value, fallback = 0) {
  const normalized = typeof value === 'string' ? value.replace(',', '.').trim() : value;
  const num = Number(normalized);
  return Number.isFinite(num) ? num : fallback;
}

function showNotification(message, type = 'success') {
  if (!notificationStack) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  notificationStack.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function daysInMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate();
}

function weekdayLabel(date) {
  return date.toLocaleDateString('de-AT', { weekday: 'long' });
}

function weekdayLabelFromKey(key) {
  return WEEKDAY_LABELS[key] || key;
}

function isWeekend(date) {
  const w = date.getDay();
  return w === 0 || w === 6;
}

function isHoliday(date) {
  const key = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return SALZBURG_HOLIDAYS[key];
}

function isDateWithinRange(date, startStr, endStr) {
  const start = parseISODate(startStr);
  const end = parseISODate(endStr);
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
}

function findWeekdayRuleForDate(date) {
  const rules = state.rules?.weekdayRules || [];
  if (!rules.length) return null;
  const matches = rules.filter((rule) => isDateWithinRange(date, rule.start, rule.end));
  if (matches.length) {
    return matches.sort((a, b) => (a.start || '').localeCompare(b.start || ''))[matches.length - 1];
  }
  return rules.slice().sort((a, b) => (a.start || '').localeCompare(b.start || ''))[rules.length - 1];
}

function currentWeekdayRule() {
  return findWeekdayRuleForDate(currentMonth) || state.rules?.weekdayRules?.[0] || null;
}

function parseTime(timeString) {
  const [h, m] = timeString.split(':').map(Number);
  return h + m / 60;
}

function serviceDuration(service) {
  const start = parseTime(service.start);
  const end = parseTime(service.end);
  const duration = end >= start ? end - start : 24 - start + end;
  return Math.max(duration, 0);
}

function formatHours(value) {
  if (value === undefined || value === null || Number.isNaN(value)) return '–';
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1);
}

const HTML_ESCAPE = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
HTML_ESCAPE['"'] = '&quot;';
HTML_ESCAPE["'"] = '&#39;';

function escapeHtml(value) {
  if (value === undefined || value === null) return '';
  return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPE[char] || char);
}

function vacationBreakdown(startStr, endStr) {
  const start = parseISODate(startStr);
  const end = parseISODate(endStr);
  if (!start || !end) return {};
  const begin = start <= end ? start : end;
  const finish = start <= end ? end : start;
  const cursor = new Date(begin.getTime());
  const perYear = {};
  while (cursor <= finish) {
    const year = cursor.getFullYear();
    perYear[year] = (perYear[year] || 0) + 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return perYear;
}

function vacationUsageByYear(emp) {
  const usage = {};
  (emp.vacations || []).forEach((entry) => {
    const breakdown = vacationBreakdown(entry.start, entry.end);
    Object.entries(breakdown).forEach(([year, days]) => {
      usage[year] = (usage[year] || 0) + days;
    });
  });
  return usage;
}

function remainingVacationDays(emp, year) {
  const { stats } = vacationStats(emp);
  const entry = stats.find((s) => s.year === year);
  if (!entry) return Number(emp.vacationDays) || 0;
  if (typeof entry.remainingWithCarry === 'number') return entry.remainingWithCarry;
  return entry.remaining;
}

function vacationStats(emp) {
  const allowance = Number(emp.vacationDays) || 0;
  const usage = vacationUsageByYear(emp);
  const currentYear = currentMonth.getFullYear();
  const nextYear = currentYear + 1;
  const summaryYears = new Set([currentYear, nextYear]);
  Object.keys(usage).forEach((year) => summaryYears.add(Number(year)));
  let stats = Array.from(summaryYears)
    .filter((year) => Number.isFinite(year))
    .map((year) => ({
      year,
      used: usage[year] || 0,
      remaining: Math.max(allowance - (usage[year] || 0), 0),
    }));
  const ensureStat = (year) => {
    let entry = stats.find((s) => s.year === year);
    if (!entry) {
      entry = { year, used: usage[year] || 0, remaining: Math.max(allowance - (usage[year] || 0), 0) };
      stats.push(entry);
    }
    return entry;
  };
  const currentStat = ensureStat(currentYear);
  const nextStat = ensureStat(nextYear);
  const carry = Math.max(currentStat.remaining, 0);
  nextStat.remainingWithCarry = nextStat.remaining + carry;
  nextStat.carry = carry;
  stats = stats.sort((a, b) => a.year - b.year);
  return { allowance, stats };
}

function vacationBalanceText(emp) {
  const { allowance, stats } = vacationStats(emp);
  const base = `Anspruch: ${allowance} Tage`;
  const rest = stats.map((entry) => {
    const remaining = entry.remainingWithCarry ?? entry.remaining;
    const carryText = entry.carry ? `, inkl. ${entry.carry} Tage Übertrag` : '';
    return `${entry.year}: ${remaining} Tage frei (${entry.used} verplant${carryText})`;
  });
  return [base].concat(rest).join(' · ');
}

function employeeVacationLine(emp) {
  const { allowance, stats } = vacationStats(emp);
  const currentYear = currentMonth.getFullYear();
  const nextYear = currentYear + 1;
  const current =
    stats.find((entry) => entry.year === currentYear) ||
    { year: currentYear, remaining: allowance, used: 0 };
  const next =
    stats.find((entry) => entry.year === nextYear) ||
    { year: nextYear, remaining: allowance, used: 0, remainingWithCarry: allowance + Math.max(current.remaining, 0) };
  const nextRemaining = next.remainingWithCarry ?? next.remaining;
  const carryText = next.carry ? `, inkl. ${next.carry} Übertrag` : '';
  return `Anspruch: ${allowance} Tage · ${currentYear}: ${current.remaining} Tage frei (${current.used} verplant) · ${nextYear}: ${nextRemaining} Tage frei (${next.used} verplant${carryText})`;
}

function calculateVacationDays(startStr, endStr) {
  const breakdown = vacationBreakdown(startStr, endStr);
  return Object.values(breakdown).reduce((sum, days) => sum + days, 0);
}

function formatVacationRange(entry) {
  const start = parseISODate(entry.start);
  const end = parseISODate(entry.end);
  if (!start || !end) return '';
  const formatter = new Intl.DateTimeFormat('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  if (entry.start === entry.end) return formatter.format(start);
  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

function formatShortDate(value) {
  const date = parseISODate(value);
  if (!date) return '';
  return date.toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function findVacationOnDate(emp, date) {
  if (!emp.vacations?.length) return null;
  return emp.vacations.find((entry) => {
    const start = parseISODate(entry.start);
    const end = parseISODate(entry.end);
    if (!start || !end) return false;
    const begin = start <= end ? start : end;
    const finish = start <= end ? end : start;
    return date >= begin && date <= finish;
  });
}

function findSickOnDate(emp, date) {
  if (!emp.sickLeaves?.length) return null;
  return emp.sickLeaves.find((entry) => {
    const start = parseISODate(entry.start);
    const end = parseISODate(entry.end);
    if (!start || !end) return false;
    const begin = start <= end ? start : end;
    const finish = start <= end ? end : start;
    return date >= begin && date <= finish;
  });
}

function isEmployeeActiveOnDate(emp, date) {
  if (!emp) return false;
  if (emp.status === 'exited') return false;
  const hire = parseISODate(emp.hireDate);
  const exit = parseISODate(emp.endDate);
  if (hire && date < hire) return false;
  if (exit && date > exit) return false;
  return true;
}

function isEmployeeActiveInMonth(emp, monthDate) {
  if (emp.status === 'exited') return false;
  const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const hire = parseISODate(emp.hireDate);
  const exit = parseISODate(emp.endDate);
  if (hire && hire > end) return false;
  if (exit && exit < start) return false;
  return true;
}

function isEmployeeFullMonth(emp, monthDate) {
  if (!isEmployeeActiveInMonth(emp, monthDate)) return false;
  const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const hire = parseISODate(emp.hireDate);
  const exit = parseISODate(emp.endDate);
  if (hire && hire > start) return false;
  if (exit && exit < end) return false;
  return true;
}

function activeDaysInMonth(emp, monthDate) {
  if (!isEmployeeActiveInMonth(emp, monthDate)) return 0;
  const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const hire = parseISODate(emp.hireDate);
  const exit = parseISODate(emp.endDate);
  const begin = hire && hire > start ? hire : start;
  const finish = exit && exit < end ? exit : end;
  const diff = finish.getTime() - begin.getTime();
  return Math.floor(diff / (24 * 60 * 60 * 1000)) + 1;
}

function monthlyTargetHours(emp, monthDate) {
  const employment = state.employment.find((e) => e.id === emp.employmentHours);
  const base = Number(employment?.hours) || 0;
  const totalDays = daysInMonth(monthDate);
  const activeDays = activeDaysInMonth(emp, monthDate);
  if (activeDays <= 0) return 0;
  if (!base || activeDays >= totalDays) return base;
  const fraction = (base * activeDays) / totalDays;
  return Math.round(fraction * 100) / 100;
}

function expandDateRange(startStr, endStr) {
  const start = parseISODate(startStr);
  const end = parseISODate(endStr);
  if (!start || !end) return [];
  const begin = start <= end ? start : end;
  const finish = start <= end ? end : start;
  const cursor = new Date(begin.getTime());
  const dates = [];
  while (cursor <= finish) {
    dates.push(formatISODate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function countVacationsOnDate(date) {
  if (!date) return 0;
  return state.employees.filter((emp) => isEmployeeActiveOnDate(emp, date) && !!findVacationOnDate(emp, date)).length;
}

function weekendKeyForDate(date) {
  if (!isWeekend(date)) return null;
  const saturday = date.getDay() === 6 ? date : new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
  if (
    saturday.getMonth() === currentMonth.getMonth() &&
    saturday.getFullYear() === currentMonth.getFullYear()
  ) {
    return `${saturday.getFullYear()}-${saturday.getMonth()}-${saturday.getDate()}`;
  }
  if (date.getDay() === 0) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
  return null;
}

function weekendKeyForDay(day) {
  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
  return weekendKeyForDate(date);
}

function workedWeekendSet(monthKey, empId) {
  const assignments = state.assignments[monthKey]?.[empId] || {};
  const keys = new Set();
  Object.keys(assignments).forEach((dayStr) => {
    const day = Number(dayStr);
    if (!assignments[day]) return;
    const key = weekendKeyForDay(day);
    if (key) keys.add(key);
  });
  return keys;
}

function totalWeekendsInMonth(date) {
  let count = 0;
  const days = daysInMonth(date);
  for (let i = 1; i <= days; i++) {
    const d = new Date(date.getFullYear(), date.getMonth(), i);
    if (d.getDay() === 6) count++;
  }
  return count;
}

function getVacationLimitForDate(date) {
  const overrides = state.vacationLimits || [];
  if (date) {
    const match = overrides.find((entry) => isDateWithinRange(date, entry.start, entry.end));
    if (match && Number.isFinite(Number(match.limit))) {
      const limit = Number(match.limit);
      if (limit > 0) return limit;
      return null;
    }
  }
  const fallback = Number(state.rules?.vacationDefault);
  return Number.isFinite(fallback) && fallback > 0 ? fallback : null;
}

function applyTheme(theme) {
  const next = theme === 'light' ? 'light' : 'dark';
  currentTheme = next;
  if (typeof document !== 'undefined' && document.body) {
    document.body.classList.toggle('light-theme', next === 'light');
    document.body.classList.toggle('dark-theme', next !== 'light');
  }
  if (themeToggle) {
    themeToggle.textContent = next === 'light' ? 'Dunkler Modus' : 'Heller Modus';
  }
  localStorage.setItem(THEME_STORAGE_KEY, next);
}

function usesDailyHoursForVacation(entry) {
  const meta = VACATION_TYPES[entry?.type];
  return meta ? meta.usesDailyHours : true;
}

function usesDailyHoursForSick(entry) {
  const meta = SICK_TYPES[entry?.kind];
  return meta ? meta.usesDailyHours : true;
}

function hasBirthdayOnDate(emp, date) {
  if (!emp.birthday) return false;
  const birthday = parseISODate(emp.birthday);
  if (!birthday) return false;
  return birthday.getDate() === date.getDate() && birthday.getMonth() === date.getMonth();
}

function clearAssignmentsForRange(empId, startStr, endStr, options = {}) {
  const keepAssignments = !!options.keepAssignments;
  const keepLocks = !!options.keepLocks;
  const trackEntry = options.trackEntry;
  const start = parseISODate(startStr);
  const end = parseISODate(endStr);
  if (!start || !end) return;
  const begin = start <= end ? start : end;
  const finish = start <= end ? end : start;
  const cursor = new Date(begin.getTime());
  if (trackEntry && !trackEntry.clearedAssignments) trackEntry.clearedAssignments = {};
  while (cursor <= finish) {
    const monthKey = getMonthKey(cursor);
    const day = cursor.getDate();
    const monthAssignments = state.assignments[monthKey];
    const monthLocks = state.locks[monthKey];
    if (monthAssignments && monthAssignments[empId] && !keepAssignments) {
      const serviceId = monthAssignments[empId][day];
      if (serviceId && trackEntry) {
        trackEntry.clearedAssignments[formatISODate(cursor)] = serviceId;
      }
      delete monthAssignments[empId][day];
      if (!Object.keys(monthAssignments[empId]).length) {
        delete monthAssignments[empId];
      }
    }
    if (monthLocks && monthLocks[empId] && !keepLocks) {
      delete monthLocks[empId][day];
      if (!Object.keys(monthLocks[empId]).length) {
        delete monthLocks[empId];
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }
}

function ensureWeekdaySelections(source = {}, servicesList = state?.services ?? []) {
  const cleaned = {};
  const validIds = new Set((servicesList || []).map((s) => s.id));
  WEEKDAY_KEYS.forEach((key) => {
    const raw = Array.isArray(source?.[key]) ? source[key] : [];
    cleaned[key] = raw.filter((id) => validIds.has(id));
  });
  return cleaned;
}

function getRequiredServiceIdsForDate(date) {
  const rule = findWeekdayRuleForDate(date);
  const config = rule?.services || {};
  const holidayLabel = isHoliday(date);
  const weekday = date.getDay();
  let ids = [];
  if (holidayLabel && config.holiday?.length) {
    ids = config.holiday;
  } else if (config[weekday]?.length) {
    ids = config[weekday];
  }
  const filtered = ids.filter((id) => state.services.some((s) => s.id === id));
  if (filtered.length) return filtered;
  return state.services.map((s) => s.id);
}

function getRequiredServicesForDate(date) {
  return getRequiredServiceIdsForDate(date)
    .map((id) => state.services.find((s) => s.id === id))
    .filter(Boolean);
}

function remainingServicesForDay(day, monthKey, date) {
  const requiredIds = getRequiredServiceIdsForDate(date);
  const remaining = requiredIds.slice();
  state.employees.forEach((emp) => {
    if (!isEmployeeActiveOnDate(emp, date)) return;
    const assigned = state.assignments?.[monthKey]?.[emp.id]?.[day];
    if (!assigned) return;
    const idx = remaining.indexOf(assigned);
    if (idx !== -1) remaining.splice(idx, 1);
  });
  return remaining
    .map((id) => state.services.find((s) => s.id === id))
    .filter(Boolean);
}

function allowedServicesForEmployee(emp, assigned) {
  const func = state.functions.find((f) => f.id === emp.functionId);
  const allowedIds = Array.isArray(func?.serviceIds) && func.serviceIds.length ? func.serviceIds : [];
  const services = allowedIds.length ? state.services.filter((s) => allowedIds.includes(s.id)) : [];
  return services
    .filter((service) => {
      if (!service) return false;
      if (isNightService(service) && !emp.nightAllowed) return false;
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base', numeric: true }));
}

function renderFunctionServiceChoices(selectedIds = []) {
  if (!functionServices) return;
  const selected = new Set(Array.isArray(selectedIds) ? selectedIds : []);
  functionServices.innerHTML = state.services
    .map(
      (s) => `
        <label>
          <input type="checkbox" value="${s.id}" ${selected.has(s.id) ? 'checked' : ''}>
          <span>${s.name}</span>
          <small>${[s.start, s.end].filter(Boolean).join(' – ')}</small>
        </label>`
    )
    .join('');
}

function selectedFunctionServiceIds() {
  if (!functionServices) return [];
  return Array.from(functionServices.querySelectorAll('input[type="checkbox"]:checked')).map((input) => input.value);
}

function updateDropdowns() {
  const prevEmployee = employeePicker.value;
  const prevService = servicePicker.value;
  const prevFunction = functionPicker.value;
  const prevEmployment = employmentPicker.value;
  employmentPercentSelect.innerHTML = state.employment.map((e) => `<option value="${e.id}">${e.percent}%</option>`).join('');
  employmentHoursSelect.innerHTML = state.employment.map((e) => `<option value="${e.id}">${e.hours} Std.</option>`).join('');
  functionSelect.innerHTML =
    '<option value="">Keine Funktion</option>' +
    state.functions
      .map((f) => {
        const label = f.status === 'removed' ? `${f.name} (Entfernt)` : f.name;
        const disabled = f.status === 'removed' ? ' disabled' : '';
        return `<option value="${f.id}"${disabled}>${label}</option>`;
      })
      .join('');
  const employeeOptions = state.employees
    .filter((e) => e.status !== 'exited')
      .map((e) => `<option value="${e.id}">${e.lastName}, ${e.firstName}</option>`)
      .join('');
  employeePicker.innerHTML = ['<option value="">Neu anlegen</option>', employeeOptions].join('');
  servicePicker.innerHTML = ['<option value="">Neu anlegen</option>']
    .concat(state.services.map((s) => `<option value="${s.id}">${s.name}</option>`))
    .join('');
  if (employeeAreasSelect) {
    employeeAreasSelect.innerHTML = AREAS.map((area) => `<option value="${area}">${area}</option>`).join('');
  }
  functionPicker.innerHTML = ['<option value="">Neu anlegen</option>']
    .concat(state.functions.map((f) => `<option value="${f.id}">${f.name}${f.status === 'removed' ? ' (Entfernt)' : ''}</option>`))
    .join('');
  employmentPicker.innerHTML = ['<option value="">Neu anlegen</option>']
    .concat(state.employment.map((e) => `<option value="${e.id}">${e.percent}% · ${e.hours} Std</option>`))
    .join('');
  if (prevEmployee && state.employees.some((e) => e.id === prevEmployee)) employeePicker.value = prevEmployee;
  if (prevService && state.services.some((s) => s.id === prevService)) servicePicker.value = prevService;
  if (prevFunction && state.functions.some((f) => f.id === prevFunction)) functionPicker.value = prevFunction;
  if (prevEmployment && state.employment.some((e) => e.id === prevEmployment)) employmentPicker.value = prevEmployment;
  const selectedFunction = state.functions.find((f) => f.id === editing.function);
  renderFunctionServiceChoices(selectedFunction?.serviceIds || []);
  updateGroupPicker();
}

function renderEmployees() {
  const changed = updateExitedEmployees(false);
  updateDropdowns();
  if (!employeeList) return;
  if (changed) saveState();
  if (!state.employees.length) {
    employeeList.innerHTML = '<p class="muted">Noch keine Mitarbeiter angelegt.</p>';
    renderOpenSickList();
    return;
  }

  const renderCard = (emp) => {
    const percent = state.employment.find((e) => e.id === emp.employmentPercent);
    const hours = state.employment.find((e) => e.id === emp.employmentHours);
    const func = state.functions.find((f) => f.id === emp.functionId);
    const vacations = buildVacationOverview(emp);
    const sickLeaves = buildSickOverview(emp);
    const logs = buildLogOverview('employees', emp.id);
    const hireInfo = emp.hireDate ? `Eintritt: ${formatShortDate(emp.hireDate)}` : 'Eintritt offen';
    const exitInfo = emp.endDate ? ` · Austritt: ${formatShortDate(emp.endDate)}` : '';
    const statusPill = emp.status === 'exited' ? '<span class="status-pill danger">Ausgeschieden</span>' : '';
    const activateButton =
      emp.status === 'exited'
        ? `<div class="entry-actions"><button type="button" class="ghost" data-activate-employee="${emp.id}">Aktivieren</button></div>`
        : '';
    return `
        <div class="item employee-card">
          <div class="employee-card__header">
            <div class="employee-card__title-row"><strong>${formatName(emp)}</strong>${statusPill}</div>
            <small>PNR ${emp.personnelNumber} · ${emp.birthday}</small>
            <small>${percent?.percent ?? '?'}% · ${hours?.hours ?? '?'} Std · ${func?.name ?? 'keine Funktion'} · Nacht: ${
              emp.nightAllowed ? 'ja' : 'nein'
            } · RKT: ${emp.rkt ? 'ja' : 'nein'} · Doppelnacht: ${emp.doubleNights ? 'ja' : 'nein'}</small>
            <small>${hireInfo}${exitInfo}</small>
          </div>
          <div class="employee-card__meta">${employeeVacationLine(emp)}</div>
          <div class="card-details">
            ${renderDetailsSection('Urlaube', vacations)}
            ${renderDetailsSection('Krankenstände', sickLeaves)}
            ${renderDetailsSection('Logs', logs)}
          </div>
          ${activateButton}
        </div>`;
  };

  const active = state.employees.filter((emp) => emp.status !== 'exited');
  const exited = state.employees.filter((emp) => emp.status === 'exited');
  const renderSection = (title, list, emptyText, open = false) => `
    <details class="collapsible" ${open ? 'open' : ''}>
      <summary>${title} (${list.length})</summary>
      <div class="employee-section">
        ${list.length ? list.map(renderCard).join('') : `<p class=\"muted\">${emptyText}</p>`}
      </div>
    </details>`;

  employeeList.innerHTML = [
    renderSection('Aktive Mitarbeiter', active, 'Noch keine aktiven Mitarbeiter.'),
    renderSection('Ausgeschieden', exited, 'Keine ausgeschiedenen Mitarbeiter.'),
  ].join('');
  renderOpenSickList();
  autoFillTicketReporterEmail();
}

function renderDetailsSection(label, data) {
  const count = typeof data.count === 'number' ? data.count : 0;
  return `<details><summary>${label} (${count})</summary>${data.body}</details>`;
}

function buildVacationOverview(emp) {
  if (!emp.vacations?.length) {
    return { count: 0, body: '<p class="log-inline">Noch keine Einträge</p>' };
  }
  const items = emp.vacations
    .slice()
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((entry) => {
      const days = calculateVacationDays(entry.start, entry.end);
      const meta = VACATION_TYPES[entry.type] || VACATION_TYPES.vacation;
      const reason = entry.reason ? ` · Grund: ${escapeHtml(entry.reason)}` : '';
      return `<li><strong>${formatVacationRange(entry)}</strong><small>${days} Tag${days === 1 ? '' : 'e'} · ${meta.name}${reason}</small></li>`;
    })
    .join('');
  return { count: emp.vacations.length, body: `<ul>${items}</ul>` };
}

function buildSickOverview(emp) {
  if (!emp.sickLeaves?.length) {
    return { count: 0, body: '<p class="log-inline">Noch keine Einträge</p>' };
  }
  const items = emp.sickLeaves
    .slice()
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((entry) => {
      const days = calculateVacationDays(entry.start, entry.end);
      const meta = SICK_TYPES[entry.kind] || SICK_TYPES.sick;
      const statusMarkup = renderSickStatus(entry);
      return `<li><strong>${formatVacationRange(entry)}</strong><small>${days} Tag${days === 1 ? '' : 'e'} · ${meta.name}</small>${statusMarkup}</li>`;
    })
    .join('');
  return { count: emp.sickLeaves.length, body: `<ul>${items}</ul>` };
}

function renderSickStatus(entry) {
  const confirmed = !!entry?.confirmed;
  const icon = confirmed
    ? '<span class="status-icon positive" aria-hidden="true">✔</span>'
    : '<span class="status-icon negative" aria-hidden="true">✗</span>';
  const text = confirmed ? 'Meldung erhalten' : 'keine Meldung';
  return `<span class="status-label" title="${escapeHtml(text)}">${icon}<span>${text}</span></span>`;
}

function buildLogOverview(section, entityId) {
  const entries = logsFor(section, entityId);
  if (!entries.length) {
    return { count: 0, body: '<p class="log-inline">Noch keine Einträge</p>' };
  }
  const items = entries
    .map((entry) => `<li><small>${formatLogTimestamp(entry.timestamp)}</small><span>${entry.message}</span></li>`)
    .join('');
  return { count: entries.length, body: `<ul>${items}</ul>` };
}

function renderLogDetails(section, entityId) {
  const data = buildLogOverview(section, entityId);
  return renderDetailsSection('Logs', data);
}

function renderVacationPanel(emp) {
  if (!vacationPanel) return;
  if (!emp) {
    vacationPanel.hidden = true;
    vacationList.innerHTML = '';
    vacationBalance.textContent = '';
    if (vacationTypeSelect) vacationTypeSelect.value = 'vacation';
    if (vacationReasonInput) vacationReasonInput.value = '';
    updateVacationReasonVisibility();
    return;
  }
  vacationPanel.hidden = false;
  vacationBalance.textContent = vacationBalanceText(emp);
  updateVacationReasonVisibility();
  if (!emp.vacations?.length) {
    vacationList.innerHTML = '<li class="muted">Noch kein Urlaub eingetragen</li>';
    return;
  }
  const entries = emp.vacations.slice().sort((a, b) => a.start.localeCompare(b.start));
  vacationList.innerHTML = entries
    .map((entry) => {
      const days = calculateVacationDays(entry.start, entry.end);
      const meta = VACATION_TYPES[entry.type] || VACATION_TYPES.vacation;
      const reason = entry.reason ? `<span class="muted">Grund: ${escapeHtml(entry.reason)}</span>` : '';
      return `
        <li>
          <div class="entry-line">
            <div>
              <strong>${formatVacationRange(entry)}</strong>
              <span class="muted">${days} Tag${days === 1 ? '' : 'e'} · ${meta.name}</span>
              ${reason}
            </div>
            <div class="entry-actions">
              <button type="button" class="ghost" data-remove-vacation="${entry.id}">Entfernen</button>
            </div>
          </div>
        </li>`;
    })
    .join('');
}

function updateVacationReasonVisibility() {
  if (!vacationReasonWrapper || !vacationTypeSelect) return;
  const meta = VACATION_TYPES[vacationTypeSelect.value] || VACATION_TYPES.vacation;
  if (meta.requiresReason) {
    vacationReasonWrapper.classList.remove('hidden');
  } else {
    vacationReasonWrapper.classList.add('hidden');
    if (vacationReasonInput) vacationReasonInput.value = '';
  }
}

function renderSickPanel(emp) {
  if (!sickPanel) return;
  if (!emp) {
    sickPanel.hidden = true;
    sickList.innerHTML = '';
    if (sickTypeSelect) sickTypeSelect.value = 'sick';
    return;
  }
  sickPanel.hidden = false;
  if (!emp.sickLeaves?.length) {
    sickList.innerHTML = '<li class="muted">Noch kein Krankenstand eingetragen</li>';
    return;
  }
  const entries = emp.sickLeaves.slice().sort((a, b) => a.start.localeCompare(b.start));
  sickList.innerHTML = entries
    .map((entry) => {
      const days = calculateVacationDays(entry.start, entry.end);
      const meta = SICK_TYPES[entry.kind] || SICK_TYPES.sick;
      const statusMarkup = renderSickStatus(entry);
      return `
        <li>
          <div class="entry-line">
            <div>
              <strong>${formatVacationRange(entry)}</strong>
              <span class="muted">${days} Tag${days === 1 ? '' : 'e'} · ${meta.name}</span>
              ${statusMarkup}
            </div>
            <div class="entry-actions">
              <label class="checkbox inline">
                <input type="checkbox" data-confirm-sick="${entry.id}" ${entry.confirmed ? 'checked' : ''}> Krankmeldung erhalten
              </label>
              <button type="button" class="ghost" data-remove-sick="${entry.id}">Entfernen</button>
            </div>
          </div>
        </li>`;
    })
    .join('');
}

function handleAddVacation() {
  if (!editing.employee) {
    alert('Bitte zuerst einen Mitarbeiter auswählen.');
    return;
  }
  const emp = state.employees.find((e) => e.id === editing.employee);
  if (!emp) return;
  if (!vacationStartInput.value) {
    alert('Bitte ein Startdatum wählen.');
    return;
  }
  const start = vacationStartInput.value;
  const end = vacationEndInput.value || vacationStartInput.value;
  const ordered = start <= end ? { start, end } : { start: end, end: start };
  const type = VACATION_TYPES[vacationTypeSelect?.value] ? vacationTypeSelect.value : 'vacation';
  const meta = VACATION_TYPES[type];
  const reasonValue = vacationReasonInput?.value?.trim() || '';
  if (meta.requiresReason && !reasonValue) {
    alert('Bitte einen Grund für den Sonderurlaub angeben.');
    return;
  }
  const breakdown = vacationBreakdown(ordered.start, ordered.end);
  const conflicts = Object.entries(breakdown).filter(([year, days]) => {
    const remaining = remainingVacationDays(emp, Number(year));
    return days > remaining;
  });
  if (conflicts.length) {
    const summary = conflicts.map(([year, days]) => `${year}: ${days} Tage`).join(', ');
    if (!confirm(`Der Urlaub überschreitet den verfügbaren Resturlaub (${summary}). Trotzdem speichern?`)) {
      return;
    }
  }
  const violation = expandDateRange(ordered.start, ordered.end).find((dateStr) => {
    const date = parseISODate(dateStr);
    const limit = getVacationLimitForDate(date);
    if (!limit) return false;
    const count = countVacationsOnDate(date);
    return count >= limit;
  });
  if (violation) {
    const date = parseISODate(violation);
    const label = date ? date.toLocaleDateString('de-AT', { dateStyle: 'medium' }) : violation;
    alert(`Für ${label} ist die maximale Anzahl an Urlauber*innen bereits erreicht.`);
    return;
  }
  const entry = { id: uuid(), start: ordered.start, end: ordered.end, type, reason: reasonValue };
  emp.vacations.push(entry);
  if (meta.clearsAssignments) {
    clearAssignmentsForRange(emp.id, entry.start, entry.end, { trackEntry: entry });
  }
  appendLog('employees', `${meta.name} ${formatVacationRange(entry)} für ${formatName(emp)} gespeichert.`, emp.id);
  saveState();
  renderVacationPanel(emp);
  renderEmployees();
  renderRoster();
  vacationStartInput.value = '';
  vacationEndInput.value = '';
  if (vacationReasonInput) vacationReasonInput.value = '';
  updateVacationReasonVisibility();
}

function handleVacationListClick(event) {
  const button = event.target instanceof Element ? event.target.closest('[data-remove-vacation]') : null;
  if (!button) return;
  if (!editing.employee) return;
  const emp = state.employees.find((e) => e.id === editing.employee);
  if (!emp) return;
  const entry = emp.vacations.find((v) => v.id === button.dataset.removeVacation);
  if (!entry) return;
  if (!confirm('Diesen Urlaub wirklich entfernen?')) return;
  emp.vacations = emp.vacations.filter((entry) => entry.id !== button.dataset.removeVacation);
  const meta = VACATION_TYPES[entry.type] || VACATION_TYPES.vacation;
  appendLog('employees', `${meta.name} ${formatVacationRange(entry)} für ${formatName(emp)} entfernt.`, emp.id);
  saveState();
  renderVacationPanel(emp);
  renderEmployees();
  renderRoster();
}

function handleAddSick() {
  if (!editing.employee) {
    alert('Bitte zuerst einen Mitarbeiter auswählen.');
    return;
  }
  const emp = state.employees.find((e) => e.id === editing.employee);
  if (!emp) return;
  if (!sickStartInput.value) {
    alert('Bitte ein Startdatum wählen.');
    return;
  }
  const start = sickStartInput.value;
  const end = sickEndInput.value || sickStartInput.value;
  const ordered = start <= end ? { start, end } : { start: end, end: start };
  const kind = SICK_TYPES[sickTypeSelect?.value] ? sickTypeSelect.value : 'sick';
  const meta = SICK_TYPES[kind];
  const entry = { id: uuid(), start: ordered.start, end: ordered.end, confirmed: false, kind };
  emp.sickLeaves.push(entry);
  if (meta.clearsAssignments) {
    clearAssignmentsForRange(emp.id, entry.start, entry.end, { trackEntry: entry });
  }
  appendLog('employees', `${meta.name} ${formatVacationRange(entry)} für ${formatName(emp)} gespeichert.`, emp.id);
  saveState();
  renderSickPanel(emp);
  renderEmployees();
  renderRoster();
  sickStartInput.value = '';
  sickEndInput.value = '';
  if (sickTypeSelect) sickTypeSelect.value = 'sick';
}

function handleSickListClick(event) {
  const button = event.target instanceof Element ? event.target.closest('[data-remove-sick]') : null;
  if (!button) return;
  if (!editing.employee) return;
  const emp = state.employees.find((e) => e.id === editing.employee);
  if (!emp) return;
  const entry = emp.sickLeaves.find((s) => s.id === button.dataset.removeSick);
  if (!entry) return;
  if (!confirm('Diesen Krankenstand wirklich entfernen?')) return;
  emp.sickLeaves = emp.sickLeaves.filter((s) => s.id !== entry.id);
  const meta = SICK_TYPES[entry.kind] || SICK_TYPES.sick;
  appendLog('employees', `${meta.name} ${formatVacationRange(entry)} für ${formatName(emp)} entfernt.`, emp.id);
  saveState();
  renderSickPanel(emp);
  renderEmployees();
  renderRoster();
}

function handleVacationLimitSubmit(event) {
  event.preventDefault();
  if (!vacationLimitStart) return;
  const start = vacationLimitStart.value;
  if (!start) {
    alert('Bitte ein Startdatum angeben.');
    showNotification('Fehler beim Speichern', 'error');
    return;
  }
  const end = vacationLimitEnd?.value || start;
  const value = Number(vacationLimitValue?.value);
  if (!Number.isFinite(value) || value < 0) {
    alert('Bitte einen gültigen Wert eingeben.');
    showNotification('Fehler beim Speichern', 'error');
    return;
  }
  const rangeLabel = `${formatShortDate(start)}${end && end !== start ? ` – ${formatShortDate(end)}` : ''}`;
  state.vacationLimits = state.vacationLimits || [];
  const existing = state.vacationLimits.find((entry) => entry.start === start && entry.end === end);
  state.vacationLimits = state.vacationLimits.filter((entry) => entry !== existing);
  if (value === 0) {
    appendLog('vacationLimits', `Urlaubslimit für ${rangeLabel} entfernt.`, existing?.id || `${start}-${end}`);
  } else {
    const entry = { id: existing?.id || uuid(), start, end, limit: value };
    state.vacationLimits.push(entry);
    appendLog('vacationLimits', `Urlaubslimit ${value} Personen für ${rangeLabel} gespeichert.`, entry.id);
  }
  if (vacationLimitValue) vacationLimitValue.value = '';
  saveState();
  renderVacationMonitor();
  showNotification('Eintrag erfolgreich gespeichert', 'success');
}

function handleVacationLimitListClick(event) {
  const button = event.target instanceof Element ? event.target.closest('[data-remove-limit]') : null;
  if (!button) return;
  const entryId = button.dataset.removeLimit;
  if (!entryId) return;
  const entry = (state.vacationLimits || []).find((item) => item.id === entryId);
  if (!entry) return;
  const rangeLabel = `${formatShortDate(entry.start)}${
    entry.end && entry.end !== entry.start ? ` – ${formatShortDate(entry.end)}` : ''
  }`;
  if (!confirm(`Urlaubslimit für ${rangeLabel} wirklich löschen?`)) return;
  state.vacationLimits = state.vacationLimits.filter((item) => item.id !== entryId);
  appendLog('vacationLimits', `Urlaubslimit für ${rangeLabel} gelöscht.`, entryId);
  saveState();
  renderVacationMonitor();
}

function handleSickListChange(event) {
  const checkbox = event.target instanceof HTMLInputElement ? event.target : null;
  if (!checkbox || !checkbox.dataset.confirmSick) return;
  if (!editing.employee) return;
  const emp = state.employees.find((e) => e.id === editing.employee);
  if (!emp) return;
  const entry = emp.sickLeaves.find((s) => s.id === checkbox.dataset.confirmSick);
  if (!entry) return;
  entry.confirmed = checkbox.checked;
  appendLog(
    'employees',
    `Krankmeldung für ${formatName(emp)} ${checkbox.checked ? 'bestätigt' : 'zurückgenommen'} (${formatVacationRange(entry)}).`,
    emp.id
  );
  saveState();
  renderSickPanel(emp);
  renderEmployees();
  renderRoster();
}

function renderServices() {
  if (!serviceList) return;
  if (!state.services.length) {
    serviceList.innerHTML = '<p class="muted">Noch keine Dienste angelegt.</p>';
    renderLegend();
    return;
  }
  serviceList.innerHTML = state.services
    .map((s) => {
      const duration = serviceDuration(s);
      return `
        <div class="item">
          <div><strong>${s.name}</strong><br><small>${s.start} – ${s.end} (${formatHours(duration)}h · ${
            s.isNight ? 'Nachtdienst' : 'Tagdienst'
          })</small></div>
          ${renderLogDetails('services', s.id)}
        </div>`;
    })
    .join('');
  renderLegend();
}

function renderFunctions() {
  if (!functionList) return;
  if (!state.functions.length) {
    functionList.innerHTML = '<p class="muted">Noch keine Funktionen angelegt.</p>';
    return;
  }
  const active = state.functions.filter((f) => f.status !== 'removed');
  const archived = state.functions.filter((f) => f.status === 'removed');
  const renderEntry = (f) => {
    const ids = Array.isArray(f.serviceIds) ? f.serviceIds : [];
    const chips = ids
      .map((id) => renderServiceChip(state.services.find((s) => s.id === id)))
      .filter(Boolean)
      .join(' ');
    const statusPill = f.status === 'removed' ? '<span class="status-pill danger">Entfernt</span>' : '';
    return `
      <div class="item">
        <div class="employee-card__title-row">
          <strong>${f.name}</strong>${statusPill}
        </div>
        <div class="entry-actions">
          <button type="button" class="ghost" data-function-edit="${f.id}">Bearbeiten</button>
          ${
            f.status === 'removed'
              ? `<button type="button" class="ghost" data-function-restore="${f.id}">Wiederherstellen</button>`
              : `<button type="button" class="ghost danger" data-function-archive="${f.id}">Entfernen</button>`
          }
        </div>
        <div class="service-line">${chips || '<small class="muted">Keine Dienste zugewiesen</small>'}</div>
        ${renderLogDetails('functions', f.id)}
      </div>`;
  };
  const renderSection = (title, list, open = false) => `
    <details class="collapsible" ${open ? 'open' : ''}>
      <summary>${title} (${list.length})</summary>
      <div class="employee-section">${list.length ? list.map(renderEntry).join('') : '<p class="muted">Keine Einträge.</p>'}</div>
    </details>`;
  functionList.innerHTML = [renderSection('Aktive Funktionen', active, true), renderSection('Entfernt', archived)].join('');
}

function renderEmployment() {
  if (!employmentList) return;
  if (!state.employment.length) {
    employmentList.innerHTML = '<p class="muted">Noch keine Einträge.</p>';
    return;
  }
  employmentList.innerHTML = state.employment
    .map((e) => `
      <div class="item">
        <div><strong>${e.percent}%</strong><br><small>${e.hours} Stunden/Monat</small></div>
        ${renderLogDetails('employment', e.id)}
      </div>`)
    .join('');
}

function renderWeekdaySelects() {
  weekdaySelects.forEach((select) => {
    const previous = Array.from(select.selectedOptions || []).map((opt) => opt.value);
    const options = state.services
      .map((s) => `<option value="${s.id}">${s.name} (${s.start}–${s.end})</option>`)
      .join('');
    select.innerHTML = '<option value="">Dienst auswählen…</option>' + options;
    select.value = '';
    previous.forEach((val) => {
      const option = select.querySelector(`option[value="${val}"]`);
      if (option) option.selected = true;
    });
  });
}

function renderWeekdayLists() {
  weekdayFields.forEach((field) => {
    const weekday = field.dataset.weekdayField;
    const container = field.querySelector('[data-weekday-list]');
    const list = weekdaySelections[weekday] || [];
    if (!list.length) {
      container.innerHTML = '<span class="weekday-placeholder muted">Keine Dienste hinterlegt</span>';
      return;
    }
    const counts = list.reduce((map, id) => {
      map[id] = (map[id] || 0) + 1;
      return map;
    }, {});
    container.innerHTML = Object.entries(counts)
      .map(([id, count]) => {
        const service = state.services.find((s) => s.id === id);
        if (!service) return '';
        const badge = count > 1 ? `<span class="weekday-count">×${count}</span>` : '';
        return `<span class="weekday-chip">${service.name}${badge}<button type="button" data-remove-service="${id}" aria-label="${service.name} entfernen">×</button></span>`;
      })
      .join('');
  });
}

function renderWeekdayControls() {
  renderWeekdaySelects();
  renderWeekdayLists();
}

function renderWeekdayHistory() {
  if (!weekdayHistory) return;
  const rules = state.rules?.weekdayRules || [];
  if (!rules.length) {
    weekdayHistory.innerHTML = '<p class="muted">Noch keine Einträge.</p>';
    return;
  }
  const activeRule = state.rules.weekdayRules.find((rule) => rule.id === editingWeekdayRuleId) || currentWeekdayRule();
  const sorted = rules
    .slice()
    .sort((a, b) => (a.start || '').localeCompare(b.start || ''));
  weekdayHistory.innerHTML = sorted
    .map((rule) => {
      const start = rule.start ? formatShortDate(rule.start) : 'ohne Start';
      const end = rule.end ? formatShortDate(rule.end) : 'offen';
      const range = rule.start || rule.end ? `${start} – ${end}` : 'Ohne Begrenzung';
      const services = WEEKDAY_KEYS.map((key) => {
        const ids = rule.services?.[key] || [];
        if (!ids.length) return '';
        const names = ids
          .map((id) => state.services.find((s) => s.id === id)?.name || '')
          .filter(Boolean)
          .join(', ');
        if (!names) return '';
        return `<small>${weekdayLabelFromKey(key)}: ${names}</small>`;
      })
        .filter(Boolean)
        .join('');
      const activeLabel = activeRule?.id === rule.id ? '<span class="chip">Aktiv</span>' : '';
      return `
        <div class="item">
          <div>
            <strong>${range}</strong>
            ${services || '<small class="muted">Keine Dienste definiert</small>'}
            ${activeLabel}
          </div>
          <div class="entry-actions">
            <button type="button" class="ghost" data-edit-weekday-rule="${rule.id}">Bearbeiten</button>
            <button type="button" class="ghost" data-delete-weekday-rule="${rule.id}">Entfernen</button>
          </div>
        </div>`;
    })
    .join('');
}

function setupWeekdayInteractions() {
  weekdayFields.forEach((field) => {
    const weekday = field.dataset.weekdayField;
    const addBtn = field.querySelector('[data-weekday-add]');
    const select = field.querySelector('[data-weekday-select]');
    const list = field.querySelector('[data-weekday-list]');
    if (addBtn && select) {
      addBtn.addEventListener('click', () => {
        const value = select.value;
        const values = Array.from(select.selectedOptions || []).map((opt) => opt.value).filter(Boolean);
        if (!value && !values.length) return;
        if (!weekdaySelections[weekday]) weekdaySelections[weekday] = [];
        if (values.length) {
          weekdaySelections[weekday].push(...values);
        } else {
          weekdaySelections[weekday].push(value);
        }
        renderWeekdayLists();
        select.selectedIndex = -1;
      });
    }
    if (list) {
      list.addEventListener('click', (event) => {
        const base = event.target instanceof Element ? event.target.closest('[data-remove-service]') : null;
        if (!base) return;
        const toRemove = base.dataset.removeService;
        const current = weekdaySelections[weekday] || [];
        const idx = current.indexOf(toRemove);
        if (idx !== -1) {
          current.splice(idx, 1);
          weekdaySelections[weekday] = current;
        }
        renderWeekdayLists();
      });
    }
  });
  if (weekdayHistory) {
    weekdayHistory.addEventListener('click', handleWeekdayHistoryClick);
  }
}

function handleWeekdayHistoryClick(event) {
  const editBtn = event.target instanceof Element ? event.target.closest('[data-edit-weekday-rule]') : null;
  if (editBtn) {
    loadWeekdayRuleForEdit(editBtn.dataset.editWeekdayRule);
    return;
  }
  const deleteBtn = event.target instanceof Element ? event.target.closest('[data-delete-weekday-rule]') : null;
  if (!deleteBtn) return;
  const id = deleteBtn.dataset.deleteWeekdayRule;
  if (!id) return;
  if (!confirm('Diesen Pflichtdienst-Zeitraum wirklich löschen?')) return;
  state.rules.weekdayRules = (state.rules.weekdayRules || []).filter((rule) => rule.id !== id);
  if (!state.rules.weekdayRules.length) {
    state.rules.weekdayRules = [createWeekdayRule({ services: ensureWeekdaySelections({}, state.services) })];
  }
  weekdaySelections = ensureWeekdaySelections(currentWeekdayRule()?.services || {}, state.services);
  editingWeekdayRuleId = currentWeekdayRule()?.id || null;
  appendLog('rules', 'Pflichtdiensteintrag entfernt.', id);
  saveState();
  renderWeekdayHistory();
  renderWeekdayControls();
  renderRoster();
}

function renderRules() {
  const r = state.rules;
  const form = rulesForm.elements;
  form.restAfterNight.value = r.restAfterNight ?? '';
  form.restAfterDoubleNight.value = r.restAfterDoubleNight ?? '';
  form.maxHoursWeek.value = r.maxHoursWeek ?? '';
  if (form.minFreeWeekends) form.minFreeWeekends.value = r.minFreeWeekends ?? '';
  form.maxNights.value = r.maxNights ?? '';
  if (vacationDefaultInput) vacationDefaultInput.value = r.vacationDefault ?? '';
  const activeRule = state.rules.weekdayRules.find((rule) => rule.id === editingWeekdayRuleId) || currentWeekdayRule();
  editingWeekdayRuleId = activeRule?.id || editingWeekdayRuleId || null;
  if (weekdayRangeStart) weekdayRangeStart.value = activeRule?.start || '';
  if (weekdayRangeEnd) weekdayRangeEnd.value = activeRule?.end || '';
  weekdaySelections = ensureWeekdaySelections(activeRule?.services || {}, state.services);
  renderWeekdayControls();
  renderWeekdayHistory();
  renderVacationLimitList();
  if (rulesSummary) {
    const summary = `<div><strong>Aktive Regeln</strong></div><small>Ruhe nach Nacht: ${
      r.restAfterNight ?? '–'
    } Tage · Ruhe nach Doppelnacht: ${r.restAfterDoubleNight ?? '–'} · Woche max: ${r.maxHoursWeek ?? '–'} Std · Freie Wochenenden: ${
      r.minFreeWeekends ?? '–'
    } · Nachtdienste: ${r.maxNights ?? '–'} · Urlaubslimit: ${r.vacationDefault ?? '–'} Personen</small>`;
    const rosterNotes = [
      'Tagblock 2–4 Tage, danach 1–2 Tage frei sofern möglich.',
      'Nachtblöcke berücksichtigen Doppelnacht-Einstellung und erfordern Ruhepausen laut Feldern.',
      'Wochenenden werden als Einheit geplant, direkte Wechsel D→N oder N→D werden verhindert.',
      'Mindestens 11 Stunden Ruhezeit zwischen Diensten, maximal 4 gleiche Dienste am Stück.',
      'Nachtverteilung über den Monat verteilt, Wochenendblöcke werden nicht gesplittet.',
      'Nach vollständiger Planung werden Dienste auf Mitarbeitende mit offenen Stunden verschoben, solange Regeln eingehalten bleiben.',
    ]
      .map((line) => `<li>${line}</li>`)
      .join('');
    rulesSummary.innerHTML = `<div class="item">${summary}<ul class="rule-notes">${rosterNotes}</ul>${renderLogDetails(
      'rules',
      'rules'
    )}</div>`;
  }
}

function renderLegend() {
  if (!serviceLegend) return;
  if (!state.services.length) {
    serviceLegend.innerHTML = '<p class="muted">Noch keine Dienste definiert.</p>';
    return;
  }
  const chips = state.services
    .map((service) => {
      const label = service.isNight ? ' · Nachtdienst' : '';
      return `<span>${escapeHtml(service.name)} ${service.start}–${service.end}${label}</span>`;
    })
    .join('');
  serviceLegend.innerHTML = `<strong>Dienstlegende:</strong>${chips}`;
}

function renderVacationMonitor() {
  renderVacationLimitList();
  if (vacationLimitStart && !vacationLimitStart.value) {
    vacationLimitStart.value = formatISODate(currentMonth);
  }
  if (vacationLimitEnd && !vacationLimitEnd.value) {
    vacationLimitEnd.value = formatISODate(currentMonth);
  }
}

function renderVacationLimitList() {
  if (!vacationLimitList) return;
  const entries = (state.vacationLimits || [])
    .slice()
    .sort((a, b) => (a.start || '').localeCompare(b.start || ''));
  if (!entries.length) {
    vacationLimitList.innerHTML = '<p class="muted">Keine Limits gesetzt.</p>';
    return;
  }
  vacationLimitList.innerHTML = entries
    .map((entry) => {
      const rangeLabel = `${formatShortDate(entry.start)}${
        entry.end && entry.end !== entry.start ? ` – ${formatShortDate(entry.end)}` : ''
      }`;
      return `
        <div class="item">
          <div><strong>${rangeLabel}</strong><br><small>Max. ${entry.limit} Personen</small></div>
          <div class="entry-actions">
            <button type="button" class="ghost" data-remove-limit="${entry.id}">Löschen</button>
          </div>
          ${renderLogDetails('vacationLimits', entry.id)}
        </div>`;
    })
    .join('');
}

function renderOpenSickList() {
  if (!openSickList) return;
  const entries = [];
  state.employees.forEach((emp) => {
    (emp.sickLeaves || []).forEach((entry) => {
      if (!entry.confirmed) entries.push({ emp, entry });
    });
  });
  const hasOpen = entries.length > 0;
  if (menuEmployeeAlert) {
    menuEmployeeAlert.hidden = !hasOpen;
    if (hasOpen) menuEmployeeAlert.textContent = '!';
  }
  if (openSickIndicator) {
    openSickIndicator.hidden = !hasOpen;
    if (hasOpen) openSickIndicator.textContent = '!';
  }
  if (!entries.length) {
    openSickList.innerHTML = '<p class="muted">Keine offenen Krankmeldungen.</p>';
    return;
  }
  entries.sort((a, b) => a.entry.start.localeCompare(b.entry.start));
  openSickList.innerHTML = entries
    .map(({ emp, entry }) => {
      const meta = SICK_TYPES[entry.kind] || SICK_TYPES.sick;
      const range = formatVacationRange(entry);
      const days = calculateVacationDays(entry.start, entry.end);
      return `
        <div class="item open-sick-item">
          <strong>${formatName(emp)}</strong>
          <small>${range} · ${meta.name} (${days} Tag${days === 1 ? '' : 'e'})</small>
          ${renderSickStatus(entry)}
        </div>`;
    })
    .join('');
}

function findEmployeeByName(name) {
  const normalized = (name || '').trim().toLowerCase();
  if (!normalized) return null;
  return state.employees.find(
    (emp) => `${(emp.firstName || '').toLowerCase()} ${(emp.lastName || '').toLowerCase()}`.trim() === normalized
  );
}

function autoFillTicketReporterEmail(force = false) {
  if (!ticketReporterEmailInput || !ticketReporterInput) return;
  if (ticketReporterEmailInput.value && !force) return;
  const reporterName = ticketReporterInput.value || '';
  const match =
    findEmployeeByName(reporterName) ||
    state.employees.find((emp) => emp.status !== 'exited' && emp.email) ||
    state.employees.find((emp) => emp.email);
  if (match?.email) {
    ticketReporterEmailInput.value = match.email;
  }
}

function ticketPriorityIcon(priority) {
  const map = {
    hoch: { icon: '❗', className: 'priority-high' },
    mittel: { icon: '❗', className: 'priority-medium' },
    gering: { icon: '❗', className: 'priority-low' },
  };
  const entry = map[priority] || map.mittel;
  return `<span class="ticket-priority-icon ${entry.className}" aria-hidden="true">${entry.icon}</span>`;
}

function renderTickets() {
  if (!ticketList) return;
  const editable = canManageTickets();
  const filter = ticketStatusFilter?.value || 'all';
  const allowedAreas = currentUser?.permissions?.admin ? null : currentUser?.areas || [];
  const tickets = (state.tickets || [])
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const matchesFilter = (ticket) => filter === 'all' || ticket.status === filter;
  const matchesArea = (ticket) =>
    !allowedAreas || !allowedAreas.length || !ticket.area || allowedAreas.includes(ticket.area);
  const openTickets = tickets.filter(
    (t) => t.status !== 'Geschlossen' && matchesFilter(t) && matchesArea(t)
  );
  const closedTickets = tickets.filter(
    (t) => t.status === 'Geschlossen' && (filter === 'all' || filter === 'Geschlossen') && matchesArea(t)
  );
  if (!openTickets.length && !closedTickets.length) {
    ticketList.innerHTML = '<p class="muted">Noch keine Tickets vorhanden.</p>';
    return;
  }
  const renderCard = (ticket) => {
    const created = new Date(ticket.createdAt).toLocaleString('de-AT', { dateStyle: 'short', timeStyle: 'short' });
    const updateList = (ticket.updates || [])
      .map(
        (entry) => `
            <li>
              <small>${new Date(entry.timestamp).toLocaleString('de-AT', {
                dateStyle: 'short',
                timeStyle: 'short',
              })} · ${entry.status}${entry.notify ? ' · Benachrichtigung' : ''}</small>
              <p>${escapeHtml(entry.note || 'Aktualisiert')}</p>
            </li>`
      )
      .join('');
    const statusOptions = TICKET_STATUSES.map(
      (status) => `<option value="${status}" ${ticket.status === status ? 'selected' : ''}>${status}</option>`
    ).join('');
    const priorityIcon = ticketPriorityIcon(ticket.priority);
    const closedIcon = ticket.status === 'Geschlossen' ? '<span class="status-icon success">✔</span>' : '';
    const assigneeLabel = ticket.assignee
      ? `<small>Bearbeiter: ${escapeHtml(ticket.assignee)}${
          ticket.assignedAt ? ` · ${new Date(ticket.assignedAt).toLocaleString('de-AT', { dateStyle: 'short', timeStyle: 'short' })}` : ''
        }</small>`
      : '';
    const closedInfo = ticket.closedAt
      ? `<small>Abgeschlossen am ${new Date(ticket.closedAt).toLocaleString('de-AT', { dateStyle: 'short', timeStyle: 'short' })}</small>`
      : '';
    const activity = `<details class="ticket-activity"><summary>Aktivität (${ticket.updates?.length || 0})</summary><ul class="ticket-updates">${
      updateList || '<li class="muted">Noch keine Notizen vorhanden.</li>'
    }</ul></details>`;
    return `
        <article class="ticket-card" data-ticket-id="${ticket.id}">
          <div class="ticket-header">
            <div class="ticket-title-row">
              <div class="ticket-title">
                <small class="ticket-number">Ticket ${escapeHtml(ticket.ticketNumber || ticket.id)}</small>
                <h3>${priorityIcon}${escapeHtml(ticket.name)}${closedIcon}</h3>
              </div>
              <label class="ticket-status-control">Status
                <select data-ticket-status="${ticket.id}" ${editable ? '' : 'disabled'}>${statusOptions}</select>
              </label>
            </div>
            <div class="ticket-meta">
              <small>Erstellt von ${escapeHtml(ticket.reporterName || 'Unbekannt')}${
                ticket.reporterEmail ? ` (${escapeHtml(ticket.reporterEmail)})` : ''
              }</small>
              <small>Erstellt am ${created}</small>
              <small>Bereich: ${escapeHtml(ticket.area || 'Allgemein')}</small>
              <small>Priorität: ${escapeHtml(ticket.priority)}</small>
              ${assigneeLabel}
              ${closedInfo}
            </div>
          </div>
          <p class="ticket-desc">${escapeHtml(ticket.description || 'Keine Beschreibung')}</p>
          <div class="ticket-actions">
            <label class="full-width update-note">Aktualisierung
              <textarea rows="3" data-ticket-note="${ticket.id}" placeholder="Kommentar oder Fortschritt ergänzen" ${editable ? '' : 'disabled'}></textarea>
            </label>
            <label class="checkbox inline">
              <input type="checkbox" data-ticket-notify="${ticket.id}" ${editable ? '' : 'disabled'}> Einmelder per Mail benachrichtigen
            </label>
            <div class="form-actions">
              <button type="button" class="primary" data-ticket-submit="${ticket.id}" ${editable ? '' : 'disabled'}>Speichern</button>
            </div>
          </div>
          ${activity}
        </article>`;
  };
  const openSection = openTickets.length
    ? `<div class="ticket-section"><div class="ticket-section__grid">${openTickets.map(renderCard).join('')}</div></div>`
    : '';
  const closedSection = closedTickets.length
    ? `<details class="ticket-section closed"><summary>Geschlossene Tickets (${closedTickets.length})</summary><div class="ticket-section__grid">${closedTickets
        .map(renderCard)
        .join('')}</div></details>`
    : '';
  ticketList.innerHTML = openSection + closedSection;
}

function updateTicketActionLabel(card) {
  if (!card) return;
  const button = card.querySelector('button[data-ticket-submit]');
  const notify = card.querySelector('input[data-ticket-notify]');
  if (button) button.textContent = notify?.checked ? 'Speichern und Senden' : 'Speichern';
}

function handleTicketCardChange(event) {
  const checkbox = event.target.closest('input[data-ticket-notify]');
  if (!checkbox) return;
  if (!canManageTickets()) return;
  const card = checkbox.closest('[data-ticket-id]');
  updateTicketActionLabel(card);
}

function renderServiceChip(service, options = {}) {
  if (!service) return '';
  const classes = ['service-chip'];
  if (options.strike) classes.push('strike');
  const windowLabel = service.start && service.end ? `${service.start}–${service.end}` : '';
  const tooltip = [service.name, windowLabel].filter(Boolean).join(' · ');
  return `<span class="${classes.join(' ')}" title="${escapeHtml(tooltip)}">${service.name}</span>`;
}

function setMultiSelect(select, values = []) {
  if (!select) return;
  const valueSet = new Set(values);
  Array.from(select.options).forEach((opt) => {
    opt.selected = valueSet.has(opt.value);
  });
}

function getMultiSelectValues(select) {
  if (!select) return [];
  return Array.from(select.selectedOptions).map((opt) => opt.value);
}

function fillEmployeeForm(emp) {
  const form = employeeForm.elements;
  form.firstName.value = emp.firstName || '';
  form.lastName.value = emp.lastName || '';
  form.personnelNumber.value = emp.personnelNumber || '';
  form.birthday.value = emp.birthday || '';
  form.email.value = emp.email || '';
  form.employmentPercent.value = emp.employmentPercent || '';
  form.employmentHours.value = emp.employmentHours || '';
  form.functionId.value = emp.functionId || '';
  form.vacationDays.value = emp.vacationDays ?? 0;
  form.holidayFactor.value = emp.holidayFactor ?? 0;
  form.dailyWorkHours.value = emp.dailyWorkHours ?? 0;
  form.hireDate.value = emp.hireDate || '';
  form.endDate.value = emp.endDate || '';
  form.nightAllowed.checked = !!emp.nightAllowed;
  form.rkt.checked = !!emp.rkt;
  form.doubleNights.checked = !!emp.doubleNights;
  if (employeeAreasSelect) {
    setMultiSelect(employeeAreasSelect, Array.isArray(emp.areas) ? emp.areas : []);
  }
  if (form.rosterPermission) {
    form.rosterPermission.value = emp.rosterPermission || 'write';
  }
  if (form.ticketPermission) {
    form.ticketPermission.value = emp.ticketPermission || 'edit';
  }
  if (form.admin) {
    form.admin.checked = !!emp.admin;
  }
  if (employeeExitBtn) employeeExitBtn.disabled = emp.status === 'exited';
}

function fillServiceForm(service) {
  const form = serviceForm.elements;
  form.name.value = service.name || '';
  form.start.value = service.start || '';
  form.end.value = service.end || '';
  form.isNight.checked = !!service.isNight;
}

function fillFunctionForm(func) {
  const form = functionForm.elements;
  form.name.value = func.name || '';
  const selectedIds = Array.isArray(func.serviceIds) ? func.serviceIds : [];
  renderFunctionServiceChoices(selectedIds);
}

function fillEmploymentForm(entry) {
  const form = employmentForm.elements;
  form.percent.value = entry.percent ?? '';
  form.hours.value = entry.hours ?? '';
}

function handleEmployeeForm(e) {
  e.preventDefault();
  const data = new FormData(employeeForm);
  let isUpdate = !!editing.employee;
  let existing = isUpdate ? state.employees.find((emp) => emp.id === editing.employee) : null;
  const exitDate = parseISODate(data.get('endDate'));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (exitDate) exitDate.setHours(0, 0, 0, 0);
  const personnelNumber = data.get('personnelNumber').trim();
  const duplicate = state.employees.find((emp) => emp.personnelNumber === personnelNumber && emp.id !== existing?.id);
  if (duplicate) {
    if (duplicate.status === 'exited') {
      const reactivate = confirm(
        `Dienstnummer ${personnelNumber} gehört zu ${formatName(duplicate)} (ausgeschieden). Wieder aktivieren?`
      );
      if (!reactivate) {
        showNotification('Fehler beim Speichern', 'error');
        return;
      }
      existing = duplicate;
      editing.employee = duplicate.id;
      isUpdate = true;
    } else {
      alert(`Dienstnummer ${personnelNumber} ist bereits vergeben.`);
      showNotification('Fehler beim Speichern', 'error');
      return;
    }
  }
  const entry = {
    id: editing.employee ?? uuid(),
    vacations: existing?.vacations ? clone(existing.vacations) : [],
    sickLeaves: existing?.sickLeaves ? clone(existing.sickLeaves) : [],
    groupId: existing?.groupId || null,
    firstName: data.get('firstName').trim(),
    lastName: data.get('lastName').trim(),
    personnelNumber,
    birthday: data.get('birthday'),
    email: data.get('email') || '',
    employmentPercent: data.get('employmentPercent'),
    employmentHours: data.get('employmentHours'),
    functionId: data.get('functionId'),
    vacationDays: Number(data.get('vacationDays')) || 0,
    holidayFactor: parseDecimalInput(data.get('holidayFactor'), existing?.holidayFactor || 0),
    dailyWorkHours: parseDecimalInput(data.get('dailyWorkHours'), existing?.dailyWorkHours || 0),
    hireDate: data.get('hireDate') || '',
    endDate: data.get('endDate') || '',
    nightAllowed: data.get('nightAllowed') === 'on',
    doubleNights: data.get('doubleNights') === 'on',
    rkt: data.get('rkt') === 'on',
    areas: getMultiSelectValues(employeeAreasSelect),
    rosterPermission: data.get('rosterPermission') || existing?.rosterPermission || 'write',
    ticketPermission: data.get('ticketPermission') || existing?.ticketPermission || 'edit',
    admin: data.get('admin') === 'on',
    status: existing?.status || 'active',
  };

  if (exitDate && exitDate <= today) {
    entry.status = 'exited';
  }

  if (existing?.status === 'exited' && entry.status !== 'exited') {
    entry.endDate = '';
    entry.status = 'active';
  }

  if (isUpdate) {
    if (!confirm('Wollen Sie die Änderungen wirklich speichern?')) return;
    const idx = state.employees.findIndex((emp) => emp.id === editing.employee);
    if (idx !== -1) {
      state.employees[idx] = entry;
    }
  } else {
    state.employees.push(entry);
    editing.employee = entry.id;
    employeePicker.value = entry.id;
  }
  ensureEmployeeInLayout(entry.id);
  appendLog('employees', `Mitarbeiter ${formatName(entry)} ${isUpdate ? 'aktualisiert' : 'angelegt'}.`, entry.id);
  updateExitedEmployees(false);
  saveState();
  updateDropdowns();
  renderEmployees();
  renderRoster();
  handleEmployeeFormReset();
  showNotification(isUpdate ? 'Änderung erfolgreich gespeichert' : 'Eintrag erfolgreich gespeichert', 'success');
}

function handleEmployeeFormReset() {
  editing.employee = null;
  employeePicker.value = '';
  renderVacationPanel(null);
  renderSickPanel(null);
  if (employeeExitBtn) employeeExitBtn.disabled = true;
}

function handleEmployeeExit() {
  if (!editing.employee) {
    showNotification('Fehler beim Speichern', 'error');
    alert('Bitte zuerst einen Mitarbeiter auswählen.');
    return;
  }
  const emp = state.employees.find((e) => e.id === editing.employee);
  if (!emp || emp.status === 'exited') return;
  if (!confirm(`Mitarbeiter ${formatName(emp)} wirklich als ausgeschieden markieren?`)) return;
  const today = new Date();
  emp.status = 'exited';
  if (!emp.endDate) emp.endDate = formatISODate(today);
  appendLog('employees', `Mitarbeiter ${formatName(emp)} ausgeschieden.`, emp.id);
  saveState();
  renderEmployees();
  renderRoster();
  handleEmployeeFormReset();
  showNotification('Änderung erfolgreich gespeichert', 'success');
}

function activateEmployee(id) {
  const emp = state.employees.find((e) => e.id === id);
  if (!emp || emp.status !== 'exited') return;
  if (!confirm(`Mitarbeiter ${formatName(emp)} wieder aktivieren?`)) return;
  emp.status = 'active';
  emp.endDate = '';
  ensureEmployeeInLayout(emp.id);
  appendLog('employees', `Mitarbeiter ${formatName(emp)} reaktiviert.`, emp.id);
  saveState();
  updateDropdowns();
  renderEmployees();
  renderRoster();
  showNotification('Änderung erfolgreich gespeichert', 'success');
}

function handleEmployeeListClick(event) {
  const activateBtn = event.target instanceof Element ? event.target.closest('[data-activate-employee]') : null;
  if (activateBtn) {
    activateEmployee(activateBtn.dataset.activateEmployee);
  }
}

function handleServiceForm(e) {
  e.preventDefault();
  const data = new FormData(serviceForm);
  const isUpdate = !!editing.service;
  const entry = {
    id: editing.service ?? uuid(),
    name: data.get('name').trim(),
    start: data.get('start'),
    end: data.get('end'),
    isNight: data.get('isNight') === 'on',
  };

  if (isUpdate) {
    if (!confirm('Wollen Sie die Änderungen wirklich speichern?')) return;
    const idx = state.services.findIndex((s) => s.id === editing.service);
    if (idx !== -1) state.services[idx] = entry;
  } else {
    state.services.push(entry);
    editing.service = entry.id;
    servicePicker.value = entry.id;
  }
  appendLog('services', `Dienst ${entry.name} ${isUpdate ? 'aktualisiert' : 'angelegt'}.`, entry.id);
  saveState();
  updateDropdowns();
  renderServices();
  renderFunctions();
  renderRules();
  renderRoster();
  serviceForm.reset();
  editing.service = null;
  servicePicker.value = '';
  showNotification(isUpdate ? 'Änderung erfolgreich gespeichert' : 'Eintrag erfolgreich gespeichert', 'success');
}

function handleFunctionForm(e) {
  e.preventDefault();
  const data = new FormData(functionForm);
  const isUpdate = !!editing.function;
  const existing = isUpdate ? state.functions.find((f) => f.id === editing.function) : null;
  const serviceIds = selectedFunctionServiceIds();
  const entry = { id: editing.function ?? uuid(), name: data.get('name').trim(), serviceIds, status: existing?.status || 'active' };

  if (isUpdate) {
    if (!confirm('Wollen Sie die Änderungen wirklich speichern?')) return;
    const idx = state.functions.findIndex((f) => f.id === editing.function);
    if (idx !== -1) state.functions[idx] = entry;
  } else {
    state.functions.push(entry);
    editing.function = entry.id;
    functionPicker.value = entry.id;
  }
  appendLog('functions', `Funktion ${entry.name} ${isUpdate ? 'aktualisiert' : 'angelegt'}.`, entry.id);
  saveState();
  updateDropdowns();
  renderFunctions();
  renderRoster();
  functionForm.reset();
  renderFunctionServiceChoices([]);
  editing.function = null;
  functionPicker.value = '';
  showNotification(isUpdate ? 'Änderung erfolgreich gespeichert' : 'Eintrag erfolgreich gespeichert', 'success');
}

function archiveFunction(id) {
  const func = state.functions.find((f) => f.id === id);
  if (!func || func.status === 'removed') return;
  if (!confirm(`Funktion "${func.name}" wirklich entfernen?`)) return;
  func.status = 'removed';
  appendLog('functions', `Funktion ${func.name} entfernt.`, func.id);
  if (editing.function === id) {
    functionForm.reset();
    renderFunctionServiceChoices([]);
    editing.function = null;
    functionPicker.value = '';
  }
  saveState();
  updateDropdowns();
  renderFunctions();
  renderRoster();
  showNotification('Änderung erfolgreich gespeichert', 'success');
}

function restoreFunction(id) {
  const func = state.functions.find((f) => f.id === id);
  if (!func || func.status !== 'removed') return;
  func.status = 'active';
  appendLog('functions', `Funktion ${func.name} wiederhergestellt.`, func.id);
  saveState();
  updateDropdowns();
  renderFunctions();
  renderRoster();
  showNotification('Änderung erfolgreich gespeichert', 'success');
}

function handleFunctionListClick(event) {
  const archiveBtn = event.target.closest('[data-function-archive]');
  const restoreBtn = event.target.closest('[data-function-restore]');
  const editBtn = event.target.closest('[data-function-edit]');
  if (archiveBtn) {
    archiveFunction(archiveBtn.dataset.functionArchive);
    return;
  }
  if (restoreBtn) {
    restoreFunction(restoreBtn.dataset.functionRestore);
    return;
  }
  if (editBtn) {
    const id = editBtn.dataset.functionEdit;
    functionPicker.value = id;
    handleFunctionPickerChange();
  }
}

function handleEmploymentForm(e) {
  e.preventDefault();
  const data = new FormData(employmentForm);
  const isUpdate = !!editing.employment;
  const entry = { id: editing.employment ?? uuid(), percent: Number(data.get('percent')), hours: Number(data.get('hours')) };

  if (isUpdate) {
    if (!confirm('Wollen Sie die Änderungen wirklich speichern?')) return;
    const idx = state.employment.findIndex((eItem) => eItem.id === editing.employment);
    if (idx !== -1) state.employment[idx] = entry;
  } else {
    state.employment.push(entry);
    editing.employment = entry.id;
    employmentPicker.value = entry.id;
  }
  appendLog('employment', `Anstellungsverhältnis ${entry.percent}% · ${entry.hours} Std ${isUpdate ? 'aktualisiert' : 'angelegt'}.`, entry.id);
  saveState();
  updateDropdowns();
  renderEmployment();
  renderEmployees();
  renderRoster();
  employmentForm.reset();
  editing.employment = null;
  employmentPicker.value = '';
  showNotification(isUpdate ? 'Änderung erfolgreich gespeichert' : 'Eintrag erfolgreich gespeichert', 'success');
}

function describeWeekdaySelections(selections) {
  return WEEKDAY_KEYS.map((key) => {
    const ids = selections?.[key] || [];
    if (!ids.length) return null;
    const counts = ids.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
    const services = Object.entries(counts)
      .map(([id, count]) => {
        const service = state.services.find((s) => s.id === id);
        return service ? `${service.name}${count > 1 ? `×${count}` : ''}` : '';
      })
      .filter(Boolean)
      .join(', ');
    return services ? `${weekdayLabelFromKey(key)}: ${services}` : null;
  })
    .filter(Boolean)
    .join(' | ');
}

function handleRulesForm(e) {
  e.preventDefault();
  const data = new FormData(rulesForm);
  const selections = ensureWeekdaySelections(weekdaySelections, state.services);
  const restAfterNight = toNumber(data.get('restAfterNight'));
  const restAfterDoubleNight = toNumber(data.get('restAfterDoubleNight'));
  const maxWeek = toNumber(data.get('maxHoursWeek'));
  const minFreeWeekends = toNumber(data.get('minFreeWeekends'));
  const maxNights = toNumber(data.get('maxNights'));
  const vacationDefault = toNumber(data.get('vacationDefault'));
  const start = data.get('weekdayRangeStart');
  const end = data.get('weekdayRangeEnd');
  const existingRule = state.rules.weekdayRules.find((rule) => rule.id === editingWeekdayRuleId);
  state.rules.restAfterNight = restAfterNight;
  state.rules.restAfterDoubleNight = restAfterDoubleNight;
  state.rules.maxHoursWeek = maxWeek;
  state.rules.minFreeWeekends = Number.isFinite(minFreeWeekends) ? minFreeWeekends : undefined;
  state.rules.maxNights = maxNights;
  state.rules.vacationDefault = Number.isFinite(vacationDefault)
    ? vacationDefault
    : state.rules.vacationDefault;
  const limits = [
    Number.isFinite(restAfterNight) ? `${restAfterNight} Ruhetage nach Nacht` : null,
    Number.isFinite(restAfterDoubleNight) ? `${restAfterDoubleNight} nach Doppelnacht` : null,
    Number.isFinite(maxWeek) ? `${maxWeek}h/Woche` : null,
    Number.isFinite(minFreeWeekends) ? `${minFreeWeekends} freie Wochenenden` : null,
    Number.isFinite(maxNights) ? `${maxNights} Nachtdienste` : null,
  ]
    .filter(Boolean)
    .join(', ');
  let message = `Regelwerk aktualisiert.${limits ? ` (${limits})` : ''}`;
  if (existingRule) {
    existingRule.start = start || existingRule.start || '';
    existingRule.end = end || existingRule.end || '';
    existingRule.services = selections;
    const desc = describeWeekdaySelections(selections);
    const rangeLabel = existingRule.start ? `ab ${formatShortDate(existingRule.start)}` : 'laufend';
    message = `Pflichtdienste ${rangeLabel} aktualisiert: ${desc || 'keine Dienste hinterlegt'}.`;
  } else if (start) {
    state.rules.weekdayRules = state.rules.weekdayRules || [];
    const entry = {
      id: uuid(),
      start,
      end: end || '',
      services: selections,
    };
    state.rules.weekdayRules.push(entry);
    weekdaySelections = ensureWeekdaySelections(entry.services, state.services);
    editingWeekdayRuleId = entry.id;
    if (weekdayRangeStart) weekdayRangeStart.value = '';
    if (weekdayRangeEnd) weekdayRangeEnd.value = '';
    const desc = describeWeekdaySelections(selections);
    message = `Pflichtdienste ab ${formatShortDate(start)} gespeichert: ${desc || 'keine Dienste hinterlegt'}.`;
  } else if (state.rules.weekdayRules?.length) {
    const active = currentWeekdayRule();
    if (active) {
      active.services = selections;
      editingWeekdayRuleId = active.id;
      const desc = describeWeekdaySelections(selections);
      message = `Pflichtdienste aktualisiert: ${desc || 'keine Dienste hinterlegt'}.`;
    }
  } else {
    state.rules.weekdayRules = [createWeekdayRule({ services: selections })];
    editingWeekdayRuleId = state.rules.weekdayRules[0].id;
    const desc = describeWeekdaySelections(selections);
    message = `Pflichtdienste hinterlegt: ${desc || 'keine Dienste hinterlegt'}.`;
  }
  appendLog('rules', message, 'rules');
  saveState();
  renderRules();
  renderRoster();
  rulesForm.reset();
  renderRules();
  showNotification('Änderung erfolgreich gespeichert', 'success');
}

function loadWeekdayRuleForEdit(id) {
  const target = state.rules.weekdayRules.find((rule) => rule.id === id);
  if (!target) return;
  editingWeekdayRuleId = target.id;
  weekdaySelections = ensureWeekdaySelections(target.services || {}, state.services);
  if (weekdayRangeStart) weekdayRangeStart.value = target.start || '';
  if (weekdayRangeEnd) weekdayRangeEnd.value = target.end || '';
  renderWeekdayControls();
  renderWeekdayHistory();
  renderRoster();
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function canEditRoster() {
  return !!currentUser && (currentUser.permissions?.admin || currentUser.permissions?.roster === 'write');
}

function canManageTickets() {
  return !!currentUser && (currentUser.permissions?.admin || currentUser.permissions?.tickets === 'edit');
}

function canCreateTickets() {
  return (
    !!currentUser &&
    (currentUser.permissions?.admin ||
      currentUser.permissions?.tickets === 'create' ||
      currentUser.permissions?.tickets === 'edit')
  );
}

function buildUserSession(userId, entry) {
  const emp = state.employees.find((e) => e.personnelNumber === userId);
  const basePermissions = { ...(entry?.permissions || {}) };
  if (emp) {
    basePermissions.roster = emp.rosterPermission === 'write' ? 'write' : 'read';
    basePermissions.tickets = emp.ticketPermission === 'edit' ? 'edit' : 'create';
    if (emp.admin) basePermissions.admin = true;
  }
  return {
    id: userId,
    ...entry,
    name: emp ? formatName(emp) : entry?.name || userId,
    permissions: basePermissions,
    areas: emp?.areas || AREAS,
    employeeEmail: emp?.email || '',
  };
}

function applyPermissions() {
  const loggedIn = !!currentUser;
  if (appShell) appShell.hidden = !loggedIn;
  if (logoutBtn) logoutBtn.hidden = !loggedIn;
  if (loginForm) loginForm.classList.toggle('logged-in', loggedIn);
  if (loginStatus) loginStatus.textContent = loggedIn
      ? `Angemeldet als ${currentUser.name || currentUser.id}`
      : 'Bitte einloggen.';
  const admin = !!currentUser?.permissions?.admin;
  const editRoster = canEditRoster();
  document.querySelectorAll('[data-permission]').forEach((el) => {
    const gate = el.dataset.permission;
    let allowed = loggedIn;
    if (gate === 'admin') allowed = admin;
    if (gate === 'roster-write') allowed = editRoster;
    if (gate === 'tickets-edit') allowed = canManageTickets();
    if (gate === 'tickets-create') allowed = canCreateTickets();
    el.hidden = !allowed;
  });
  const allowedScreens = admin ? null : new Set(['roster', 'ticketCreate', 'tickets']);
  menuButtons.forEach((btn) => {
    const allowed = loggedIn && (admin || allowedScreens.has(btn.dataset.target));
    btn.disabled = !allowed;
    btn.classList.toggle('disabled', !allowed);
  });
  if (!loggedIn) return;
  const activeBtn = document.querySelector('.main-menu button.active');
  const activeTarget = activeBtn?.dataset.target;
  if (!admin && activeTarget && !allowedScreens.has(activeTarget)) {
    showScreen('roster');
  }
  if (ticketForm) {
    ticketForm.querySelectorAll('input, select, textarea, button').forEach((el) => {
      el.disabled = !canCreateTickets();
    });
  }
  rosterModeButtons.forEach((btn) => {
    btn.disabled = !editRoster;
  });
  if (!editRoster) setRosterMode('view');
  if (generateBtn) generateBtn.hidden = !editRoster;
  if (clearBtn) clearBtn.hidden = !editRoster;
  if (printPlanBtn) printPlanBtn.disabled = !loggedIn;
  renderTickets();
  renderRoster();
}

function handleLogin(event) {
  event.preventDefault();
  const userId = loginUser?.value?.trim();
  const password = loginPassword?.value || '';
  const entry = userId ? USERS[userId] : null;
  if (!entry || entry.password !== password) {
    if (loginStatus) loginStatus.textContent = 'Login fehlgeschlagen.';
    showNotification('Fehler beim Login', 'error');
    return;
  }
  currentUser = buildUserSession(userId, entry);
  applyPermissions();
  showScreen('roster');
  showNotification('Login erfolgreich', 'success');
}

function handleLogout() {
  currentUser = null;
  if (loginPassword) loginPassword.value = '';
  applyPermissions();
  showNotification('Abgemeldet', 'success');
}

function autoLoginDefaultUser() {
  const defaultId = '05475';
  const entry = USERS[defaultId];
  if (!entry) return;
  currentUser = buildUserSession(defaultId, entry);
  if (loginUser) loginUser.value = defaultId;
  if (loginPassword) loginPassword.value = entry.password;
  if (ticketReporterInput) ticketReporterInput.value = currentUser.name || 'Alois Reichsöllner';
  if (ticketReporterEmailInput && currentUser.employeeEmail) ticketReporterEmailInput.value = currentUser.employeeEmail;
  applyPermissions();
  showScreen('roster');
}

function showScreen(target) {
  if (!currentUser) {
    if (appShell) appShell.hidden = true;
    return;
  }
  const admin = !!currentUser?.permissions?.admin;
  const allowedScreens = admin ? null : new Set(['roster', 'ticketCreate', 'tickets']);
  if (!admin && !allowedScreens.has(target)) {
    showNotification('Keine Berechtigung für diesen Bereich', 'error');
    return;
  }
  menuButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.target === target));
  screens.forEach((panel) => {
    if (panel.dataset.screen === target) {
      panel.removeAttribute('hidden');
    } else {
      panel.setAttribute('hidden', '');
    }
  });
  if (target === 'roster') {
    renderRoster();
  } else if (target === 'tickets') {
    renderTickets();
  } else if (target === 'ticketCreate') {
    autoFillTicketReporterEmail(true);
  } else if (target === 'rules') {
    editingWeekdayRuleId = currentWeekdayRule()?.id || editingWeekdayRuleId;
    renderRules();
  }
}

function setRosterMode(mode) {
  const next = mode === 'view' ? 'view' : 'edit';
  if (next === rosterMode) return;
  rosterMode = next;
  renderRoster();
}

function buildRosterHeader(date) {
  const days = daysInMonth(date);
  const headerRows = [document.createElement('tr'), document.createElement('tr')];
  const stickyCells = [
    '<th class="names col-info" rowspan="2"><div class="info-header"><span>Name</span><span>Personalnummer</span></div></th>',
    '<th class="names col-hours" rowspan="2"><div class="hours-header"><span>Details</span></div></th>',
  ];
  stickyCells.forEach((html) => headerRows[0].insertAdjacentHTML('beforeend', html));
  for (let day = 1; day <= days; day++) {
    const d = new Date(date.getFullYear(), date.getMonth(), day);
    const label = `<div class="day-label"><span>${day}.${String(date.getMonth() + 1).padStart(2, '0')}.</span><span>${weekdayLabel(d)}</span></div>`;
    const cls = ['day-col'];
    if (isHoliday(d)) cls.push('holiday');
    else if (d.getDay() === 0) cls.push('weekend');
    else if (d.getDay() === 6) cls.push('saturday');
    headerRows[0].insertAdjacentHTML('beforeend', `<th class="${cls.join(' ')}" colspan="1">${label}</th>`);
    headerRows[1].insertAdjacentHTML('beforeend', `<th class="${cls.join(' ')}">${day}</th>`);
  }
  rosterTable.innerHTML = '';
  headerRows.forEach((row) => rosterTable.appendChild(row));
}

function buildVacationCalendarRow(date) {
  const days = daysInMonth(date);
  const tr = document.createElement('tr');
  tr.className = 'vacation-calendar-row';
  const labelCell = document.createElement('td');
  labelCell.className = 'names col-info';
  labelCell.colSpan = 2;
  labelCell.innerHTML = `
    <div class="vacation-calendar__label">
      <strong>Urlaube</strong>
      <small>pro Tag</small>
    </div>
  `;
  tr.appendChild(labelCell);

  for (let day = 1; day <= days; day++) {
    const d = new Date(date.getFullYear(), date.getMonth(), day);
    const cls = ['day-col', 'vacation-calendar__cell'];
    if (isHoliday(d)) cls.push('holiday');
    else if (d.getDay() === 0) cls.push('weekend');
    else if (d.getDay() === 6) cls.push('saturday');
    const count = countVacationsOnDate(d);
    const limit = getVacationLimitForDate(d);
    const width = limit ? Math.min((count / limit) * 100, 100) : Math.min(count * 25, 100);
    const cell = document.createElement('td');
    cell.className = cls.join(' ');
    if (limit && count >= limit) {
      cell.classList.add('vacation-limit-hit');
    }
    cell.innerHTML = `
      <div class="vacation-meter" role="img" aria-label="${count} Urlaube${limit ? ` von ${limit}` : ''} am ${
      d.toLocaleDateString('de-AT', { weekday: 'long' })
    }">
        <span style="width:${width}%"></span>
        <small>${count}${limit ? `/${limit}` : ''}</small>
      </div>
    `;
    tr.appendChild(cell);
  }

  return tr;
}

function renderRoster() {
  const changed = updateExitedEmployees(false);
  buildRosterHeader(currentMonth);
  const monthKey = getMonthKey(currentMonth);
  ensureMonthMaps(monthKey);
  const days = daysInMonth(currentMonth);
  cleanSelectedRows();
  if (changed) saveState();
  rosterTable.appendChild(buildVacationCalendarRow(currentMonth));
  const employees = getOrderedEmployees().filter((emp) => isEmployeeActiveInMonth(emp, currentMonth));
  const renderedGroups = new Set();
  let assignmentsCleaned = false;
  const markAssignmentsDirty = () => {
    assignmentsCleaned = true;
  };

  employees.forEach((emp) => {
    if (emp.groupId) {
      const group = state.groups.find((g) => g.id === emp.groupId);
      if (group && !renderedGroups.has(group.id)) {
        rosterTable.appendChild(buildGroupRow(group, days));
        renderedGroups.add(group.id);
      }
    }
    rosterTable.appendChild(buildEmployeeRow(emp, monthKey, days, markAssignmentsDirty));
  });

  const unassignedRow = document.createElement('tr');
  unassignedRow.className = 'unassigned-row';
  unassignedRow.innerHTML = `
    <td class="names col-info" colspan="2">
      <div class="info-cell">
        <span class="emp-name">Nicht verplante Dienste</span>
      </div>
    </td>
  `;
  for (let day = 1; day <= days; day++) {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const remaining = remainingServicesForDay(day, monthKey, d);
    const cls = ['unassigned-cell', 'day-col'];
    if (isHoliday(d)) cls.push('holiday');
    else if (d.getDay() === 0) cls.push('weekend');
    else if (d.getDay() === 6) cls.push('saturday');
    if (!remaining.length) cls.push('complete');
    const td = document.createElement('td');
    td.className = cls.join(' ');
    if (remaining.length) {
      td.innerHTML = `<div class="unassigned-list">${remaining.map((s) => `<span>${s.name}</span>`).join('')}</div>`;
    } else {
      td.innerHTML = '<span class="all-assigned">Alle geplant</span>';
    }
    unassignedRow.appendChild(td);
  }
  rosterTable.appendChild(unassignedRow);

  monthLabel.textContent = currentMonth.toLocaleDateString('de-AT', { month: 'long', year: 'numeric' });
  if (rosterPanel) rosterPanel.dataset.mode = rosterMode;
  rosterModeButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.rosterMode === rosterMode);
  });
  renderLegend();
  renderVacationMonitor();
  if (editing.employee) {
    const currentEmp = state.employees.find((e) => e.id === editing.employee);
    if (currentEmp) {
      renderVacationPanel(currentEmp);
      renderSickPanel(currentEmp);
    }
  }
  updateRowToolStates();
  if (assignmentsCleaned) {
    saveState();
  }
}

function buildGroupRow(group, days) {
  const tr = document.createElement('tr');
  tr.className = 'group-row';
  tr.dataset.groupId = group.id;
  const infoCell = document.createElement('td');
  infoCell.className = 'group-name names col-info';
  infoCell.colSpan = 2;
  infoCell.innerHTML = `
    <div class="group-header">
      <strong>${group.name}</strong>
      <span class="group-header__actions">
        <button type="button" class="ghost" data-rename-group="${group.id}">Umbenennen</button>
        <button type="button" class="ghost" data-delete-group="${group.id}">Gruppe löschen</button>
      </span>
    </div>
  `;
  tr.appendChild(infoCell);
  for (let i = 0; i < days; i++) {
    const spacer = document.createElement('td');
    spacer.className = 'group-spacer day-col';
    tr.appendChild(spacer);
  }
  return tr;
}

function buildEmployeeRow(emp, monthKey, days, markAssignmentsDirty) {
  const tr = document.createElement('tr');
  tr.dataset.empRow = emp.id;
  const targetHours = monthlyTargetHours(emp, currentMonth);
  const assignedHours = hoursForEmployee(monthKey, emp.id);
  const remainingHours = targetHours - assignedHours;
  const remainingClass = remainingHours < 0 ? 'hours-remaining negative' : 'hours-remaining';
  const selected = selectedRows.has(emp.id) ? 'checked' : '';
  const nameCell = document.createElement('td');
  nameCell.className = 'names col-info';
  nameCell.innerHTML = `
    <div class="row-header">
      <label class="sr-only" for="row-select-${emp.id}">Mitarbeiter auswählen</label>
      <input type="checkbox" id="row-select-${emp.id}" data-row-select="${emp.id}" ${selected}>
      <button type="button" class="drag-handle" data-drag-handle draggable="true" aria-label="Zeile verschieben">⋮⋮</button>
      <div class="info-cell">
        <span class="emp-name">${formatName(emp)}</span>
        <span class="emp-pnr">${emp.personnelNumber}</span>
      </div>
    </div>
  `;
  tr.appendChild(nameCell);

  const hoursCell = document.createElement('td');
  hoursCell.className = 'names col-hours';
  const stats = specialShiftStats(monthKey, emp.id);
  hoursCell.innerHTML = `
    <div class="hours-cell">
      <span class="hours-target">Stundensoll: ${formatHours(targetHours)} Std</span>
      <span class="${remainingClass}">Noch: ${formatHours(remainingHours)} Std</span>
      <div class="hours-metrics">
        <span>Nachtdienste: <strong>${stats.nights}</strong></span>
        <span>Feiertagsdienste: <strong>${stats.holidayShifts}</strong></span>
      </div>
    </div>
  `;
  tr.appendChild(hoursCell);

  const fullMonthAvailability = isEmployeeFullMonth(emp, currentMonth);
  for (let day = 1; day <= days; day++) {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const cls = ['day-col'];
    if (isHoliday(d)) cls.push('holiday');
    else if (d.getDay() === 0) cls.push('weekend');
    else if (d.getDay() === 6) cls.push('saturday');
    const activeOnDate = isEmployeeActiveOnDate(emp, d);
    const monthAssignments = state.assignments[monthKey] || {};
    const monthLocks = state.locks[monthKey] || {};
    let assign = monthAssignments[emp.id]?.[day] ?? '';
    const locked = !!monthLocks[emp.id]?.[day];
    const canAssign = fullMonthAvailability && activeOnDate;
    if (!canAssign && assign && monthAssignments[emp.id]) {
      delete monthAssignments[emp.id][day];
      assign = '';
      if (!Object.keys(monthAssignments[emp.id]).length) {
        delete monthAssignments[emp.id];
      }
      if (typeof markAssignmentsDirty === 'function') {
        markAssignmentsDirty();
      }
    }
    const serviceOptions = allowedServicesForEmployee(emp, assign);
    const selectPieces = ['<option value="">–</option>'];
    let includesAssigned = false;
    serviceOptions.forEach((s) => {
      if (assign === s.id) includesAssigned = true;
      selectPieces.push(`<option value="${s.id}" ${assign === s.id ? 'selected' : ''}>${s.name}</option>`);
    });
    if (assign && !includesAssigned) {
      const fallbackService = state.services.find((s) => s.id === assign);
      if (fallbackService) {
        selectPieces.push(`<option value="${assign}" selected>${fallbackService.name}</option>`);
      }
    }
    const options = selectPieces.join('');
    const td = document.createElement('td');
    const vacationEntry = activeOnDate ? findVacationOnDate(emp, d) : null;
    const sickEntry = activeOnDate ? findSickOnDate(emp, d) : null;
    const isBirthday = hasBirthdayOnDate(emp, d);
    if (vacationEntry) cls.push('vacation');
    if (sickEntry) cls.push('sick');
    td.className = cls.join(' ');
    if (!canAssign) {
      td.classList.add('inactive');
    }
    const selectDisabled = locked || !serviceOptions.length || !canAssign;
    const parts = ['<div class="cell">'];
    if (isBirthday) {
      parts.push('<span class="birthday-flag" title="Geburtstag">🎂</span>');
    }
    const showVacation = !!vacationEntry;
    const showSick = !!sickEntry;
    const absenceMeta = showVacation ? VACATION_TYPES[vacationEntry.type] || VACATION_TYPES.vacation : null;
    const sickMeta = showSick ? SICK_TYPES[sickEntry.kind] || SICK_TYPES.sick : null;
    const showAbsence = showVacation || showSick;
    const service = serviceOptions.find((s) => s.id === assign) || state.services.find((s) => s.id === assign);
    const dateKey = formatISODate(d);
    const clearedServiceId =
      (vacationEntry?.clearedAssignments && vacationEntry.clearedAssignments[dateKey]) ||
      (sickEntry?.clearedAssignments && sickEntry.clearedAssignments[dateKey]);
    const clearedService = clearedServiceId ? state.services.find((s) => s.id === clearedServiceId) : null;
    const showServiceWithAbsence =
      (showVacation && absenceMeta?.showService && service) || (showSick && sickMeta?.showService && service);
    if (showServiceWithAbsence) {
      parts.push(renderServiceChip(service, { strike: true }));
    }
    if (!activeOnDate) {
      parts.push('<span class="muted">-</span>');
    } else if (showAbsence) {
      const label = showVacation ? absenceMeta.label : sickMeta.label;
      const titleParts = [showVacation ? absenceMeta.name : sickMeta.name];
      if (showVacation && vacationEntry.reason) titleParts.push(`Grund: ${escapeHtml(vacationEntry.reason)}`);
      if (showSick && !sickEntry.confirmed) titleParts.push('Keine Meldung');
      const title = titleParts.join(' · ');
      parts.push(
        `<span class="absence-pill ${showVacation ? 'vacation' : 'sick'}" title="${title}">${label}</span>`
      );
      if (clearedService) {
        parts.push(`<span class="cleared-service">${renderServiceChip(clearedService, { strike: true })}</span>`);
      }
    } else if (!canAssign) {
      parts.push('<span class="muted">-</span>');
    } else if (rosterMode === 'view') {
      if (service) {
        parts.push(renderServiceChip(service));
      } else {
        parts.push('<span class="muted">–</span>');
      }
    } else {
      parts.push(`<select data-emp="${emp.id}" data-day="${day}" ${selectDisabled ? 'disabled' : ''}>${options}</select>`);
      parts.push(
        `<label class="lock"><input type="checkbox" data-lock="${emp.id}" data-day="${day}" ${locked ? 'checked' : ''}> <span>Sperren</span></label>`
      );
    }
    parts.push('</div>');
    td.innerHTML = parts.join('');
    tr.appendChild(td);
  }
  return tr;
}

function handleCreateGroup() {
  if (!selectedRows.size) return;
  const name = prompt('Name der neuen Gruppe', 'Neue Gruppe');
  if (name === null) {
    renderRoster();
    return;
  }
  const trimmed = name.trim();
  if (!trimmed) {
    renderRoster();
    return;
  }
  const group = { id: uuid(), name: trimmed || 'Neue Gruppe' };
  state.groups.push(group);
  selectedRows.forEach((id) => {
    const emp = state.employees.find((e) => e.id === id);
    if (emp) emp.groupId = group.id;
  });
  appendLog('roster', `Gruppe "${group.name}" mit ${selectedRows.size} Mitarbeiter${selectedRows.size === 1 ? '' : 'n'} erstellt.`);
  saveState();
  updateGroupPicker();
  renderEmployees();
  renderRoster();
}

function handleAssignGroup() {
  if (!selectedRows.size || !groupSelect.value) return;
  const group = state.groups.find((g) => g.id === groupSelect.value);
  selectedRows.forEach((id) => {
    const emp = state.employees.find((e) => e.id === id);
    if (emp) emp.groupId = groupSelect.value;
  });
  appendLog(
    'roster',
    `${selectedRows.size} Mitarbeiter${selectedRows.size === 1 ? '' : 'n'} der Gruppe "${group?.name || 'Unbekannt'}" zugewiesen.`
  );
  saveState();
  renderRoster();
}

function handleRemoveGroup() {
  if (!selectedRows.size) return;
  selectedRows.forEach((id) => {
    const emp = state.employees.find((e) => e.id === id);
    if (emp) emp.groupId = null;
  });
  appendLog('roster', `${selectedRows.size} Mitarbeiter${selectedRows.size === 1 ? '' : 'n'} aus Gruppen gelöst.`);
  saveState();
  renderRoster();
}

function renameGroup(groupId) {
  const group = state.groups.find((g) => g.id === groupId);
  if (!group) return;
  const previous = group.name;
  const name = prompt('Neuer Gruppenname', group.name);
  if (!name) return;
  group.name = name.trim() || group.name;
  appendLog('roster', `Gruppe "${previous}" in "${group.name}" umbenannt.`);
  saveState();
  updateGroupPicker();
  renderRoster();
}

function deleteGroup(groupId) {
  const group = state.groups.find((g) => g.id === groupId);
  if (!group) return;
  if (!confirm(`Gruppe "${group.name}" wirklich löschen?`)) return;
  state.groups = state.groups.filter((g) => g.id !== groupId);
  state.employees.forEach((emp) => {
    if (emp.groupId === groupId) emp.groupId = null;
  });
  if (groupSelect.value === groupId) groupSelect.value = '';
  appendLog('roster', `Gruppe "${group.name}" gelöscht.`);
  saveState();
  updateGroupPicker();
  renderEmployees();
  renderRoster();
}

function handleRosterClick(event) {
  const renameBtn = event.target instanceof Element ? event.target.closest('[data-rename-group]') : null;
  if (renameBtn) {
    renameGroup(renameBtn.dataset.renameGroup);
    return;
  }
  const deleteBtn = event.target instanceof Element ? event.target.closest('[data-delete-group]') : null;
  if (deleteBtn) {
    deleteGroup(deleteBtn.dataset.deleteGroup);
  }
}

function handleRowDragStart(event) {
  const handle = event.target instanceof Element ? event.target.closest('[data-drag-handle]') : null;
  if (!handle) return;
  const row = handle.closest('tr[data-emp-row]');
  if (!row) return;
  draggingRowId = row.dataset.empRow;
  row.classList.add('dragging');
  event.dataTransfer.setData('text/plain', draggingRowId);
  event.dataTransfer.effectAllowed = 'move';
}

function handleRowDragOver(event) {
  if (!draggingRowId) return;
  const row = event.target instanceof Element ? event.target.closest('tr[data-emp-row]') : null;
  if (!row || row.dataset.empRow === draggingRowId) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}

function handleRowDrop(event) {
  if (!draggingRowId) return;
  const row = event.target instanceof Element ? event.target.closest('tr[data-emp-row]') : null;
  if (!row || row.dataset.empRow === draggingRowId) return;
  event.preventDefault();
  const targetId = row.dataset.empRow;
  const rect = row.getBoundingClientRect();
  const position = event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
  reorderRows(draggingRowId, targetId, position);
  finishRowDrag();
}

function handleRowDragEnd() {
  finishRowDrag();
}

function finishRowDrag() {
  const active = rosterTable.querySelector('tr.dragging');
  if (active) active.classList.remove('dragging');
  draggingRowId = null;
}

function reorderRows(sourceId, targetId, position) {
  if (sourceId === targetId) return;
  const order = state.layout.order.filter((id) => id !== sourceId);
  const targetIndex = order.indexOf(targetId);
  const insertIndex = targetIndex === -1 ? order.length : targetIndex + (position === 'after' ? 1 : 0);
  order.splice(insertIndex, 0, sourceId);
  state.layout.order = order;
  const emp = state.employees.find((e) => e.id === sourceId);
  appendLog('roster', `Zeile ${emp ? formatName(emp) : sourceId} verschoben.`);
  saveState();
  renderRoster();
}

function ensureMonthMaps(monthKey) {
  if (!state.assignments[monthKey]) state.assignments[monthKey] = {};
  if (!state.locks[monthKey]) state.locks[monthKey] = {};
}

function handleRosterChange(e) {
  if (
    rosterMode === 'view' &&
    (e.target.matches('select[data-emp]') || e.target.matches('input[type="checkbox"][data-lock]'))
  ) {
    e.preventDefault();
    return;
  }
  if (e.target.matches('input[type="checkbox"][data-row-select]')) {
    const id = e.target.dataset.rowSelect;
    if (!id) return;
    if (e.target.checked) selectedRows.add(id);
    else selectedRows.delete(id);
    updateRowToolStates();
    return;
  }
  if (e.target.matches('select[data-emp]')) {
    const emp = e.target.dataset.emp;
    const day = Number(e.target.dataset.day);
    const monthKey = getMonthKey(currentMonth);
    ensureMonthMaps(monthKey);
    if (!state.assignments[monthKey][emp]) state.assignments[monthKey][emp] = {};
    state.assignments[monthKey][emp][day] = e.target.value;
    saveState();
    renderRoster();
  }

  if (e.target.matches('input[type="checkbox"][data-lock]')) {
    const emp = e.target.dataset.lock;
    const day = Number(e.target.dataset.day);
    const monthKey = getMonthKey(currentMonth);
    ensureMonthMaps(monthKey);
    if (!state.locks[monthKey][emp]) state.locks[monthKey][emp] = {};
    state.locks[monthKey][emp][day] = e.target.checked;
    const select = document.querySelector(`select[data-emp="${emp}"][data-day="${day}"]`);
    if (select) select.disabled = e.target.checked;
    saveState();
    renderRoster();
  }
}

function countNights(monthKey, empId) {
  const assignments = state.assignments[monthKey]?.[empId] || {};
  return Object.values(assignments).filter((serviceId) => {
    const service = state.services.find((s) => s.id === serviceId);
    return isNightService(service);
  }).length;
}

function isNightService(service) {
  if (!service) return false;
  if (typeof service.isNight === 'boolean') return service.isNight;
  return /nacht/i.test(service.name);
}

function specialShiftStats(monthKey, empId) {
  const assignments = state.assignments[monthKey]?.[empId] || {};
  let nights = 0;
  let holidayShifts = 0;
  Object.entries(assignments).forEach(([day, serviceId]) => {
    const service = state.services.find((s) => s.id === serviceId);
    if (!service) return;
    if (isNightService(service)) nights++;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), Number(day));
    if (isHoliday(date) || date.getDay() === 0) holidayShifts++;
  });
  return { nights, holidayShifts };
}

function hoursForEmployee(monthKey, empId) {
  const assignments = state.assignments[monthKey]?.[empId] || {};
  let total = Object.values(assignments).reduce((sum, serviceId) => {
    const service = state.services.find((s) => s.id === serviceId);
    return service ? sum + serviceDuration(service) : sum;
  }, 0);
  const emp = state.employees.find((e) => e.id === empId);
  const baseDate = monthKeyToDate(monthKey);
  if (!emp || !baseDate) return total;
  const days = daysInMonth(baseDate);
  const holidayFactor = Number(emp.holidayFactor) || 0;
  const dailyHours = Number(emp.dailyWorkHours) || 0;
  for (let day = 1; day <= days; day++) {
    const date = new Date(baseDate.getFullYear(), baseDate.getMonth(), day);
    if (holidayFactor && isHoliday(date) && isEmployeeActiveOnDate(emp, date)) {
      total += holidayFactor;
    }
    if (dailyHours) {
      const vacationEntry = findVacationOnDate(emp, date);
      const sickEntry = findSickOnDate(emp, date);
      if (vacationEntry && usesDailyHoursForVacation(vacationEntry) && isEmployeeActiveOnDate(emp, date)) {
        total += dailyHours;
      } else if (sickEntry && usesDailyHoursForSick(sickEntry) && isEmployeeActiveOnDate(emp, date)) {
        total += dailyHours;
      }
    }
  }
  return total;
}

function lastAssignmentInfo(empId, day, monthKey) {
  const assignments = state.assignments[monthKey]?.[empId] || {};
  for (let offset = 1; offset < day; offset++) {
    const prevDay = day - offset;
    const serviceId = assignments[prevDay];
    if (serviceId) {
      const service = state.services.find((s) => s.id === serviceId);
      return { gap: offset - 1, service, serviceId };
    }
  }
  return { gap: Infinity, service: null, serviceId: null };
}

function countStreakForMonth(empId, day, predicate, monthKey) {
  const assignments = state.assignments[monthKey]?.[empId] || {};
  let streak = 0;
  for (let i = day - 1; i >= 1; i--) {
    const sid = assignments[i];
    if (!sid) break;
    const svc = state.services.find((s) => s.id === sid);
    if (!svc || !predicate(svc, sid)) break;
    streak++;
  }
  return streak;
}

function generateRoster() {
  const monthKey = getMonthKey(currentMonth);
  ensureMonthMaps(monthKey);
  const days = daysInMonth(currentMonth);
  const rules = state.rules;
  const totalWeekends = totalWeekendsInMonth(currentMonth);
  const minFreeWeekends = Number(rules.minFreeWeekends) || 0;
  const allowedWorkedWeekends = Math.max(totalWeekends - minFreeWeekends, 0);
  const orderedEmployees = getOrderedEmployees().filter((emp) => isEmployeeFullMonth(emp, currentMonth));
  const rawPivot = Number(state.layout?.generatorPivot) || 0;
  const pivot = orderedEmployees.length ? rawPivot % orderedEmployees.length : 0;
  const rotated = orderedEmployees.slice(pivot).concat(orderedEmployees.slice(0, pivot));
  const weekendSets = new Map();
  const getWeekendSet = (empId) => {
    if (!weekendSets.has(empId)) {
      weekendSets.set(empId, workedWeekendSet(monthKey, empId));
    }
    return weekendSets.get(empId);
  };

  // Bestehende, nicht gesperrte Einträge für den Monat zurücksetzen
  state.employees.forEach((emp) => {
    if (!state.assignments[monthKey][emp.id]) state.assignments[monthKey][emp.id] = {};
    for (let day = 1; day <= days; day++) {
      const locked = state.locks[monthKey]?.[emp.id]?.[day];
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const vacationEntry = findVacationOnDate(emp, date);
      const sickEntry = findSickOnDate(emp, date);
      const keepAssignment =
        (vacationEntry && VACATION_TYPES[vacationEntry.type]?.clearsAssignments === false) ||
        (sickEntry && SICK_TYPES[sickEntry.kind]?.clearsAssignments === false);
      if (!locked && !keepAssignment) {
        delete state.assignments[monthKey][emp.id][day];
      }
    }
  });

  const serviceCounts = new Map();
  const assignmentCounts = new Map();
  Object.entries(state.assignments[monthKey]).forEach(([empId, entries]) => {
    Object.values(entries).forEach((serviceId) => {
      const map = serviceCounts.get(empId) || {};
      map[serviceId] = (map[serviceId] || 0) + 1;
      serviceCounts.set(empId, map);
      assignmentCounts.set(empId, (assignmentCounts.get(empId) || 0) + 1);
    });
  });

  const getCounts = (empId, serviceId) => {
    const serviceMap = serviceCounts.get(empId) || {};
    return { service: serviceMap[serviceId] || 0, total: assignmentCounts.get(empId) || 0 };
  };

  const incrementCounts = (empId, serviceId) => {
    const map = serviceCounts.get(empId) || {};
    map[serviceId] = (map[serviceId] || 0) + 1;
    serviceCounts.set(empId, map);
    assignmentCounts.set(empId, (assignmentCounts.get(empId) || 0) + 1);
  };

  const countConsecutiveAssignments = (empId, day, predicate) =>
    countStreakForMonth(empId, day, predicate, monthKey);

  const lastDayServiceGap = (empId, day) => {
    const assignments = state.assignments[monthKey]?.[empId] || {};
    for (let i = day - 1; i >= 1; i--) {
      const sid = assignments[i];
      if (!sid) continue;
      const svc = state.services.find((s) => s.id === sid);
      if (svc && !isNightService(svc)) {
        return day - i - 1;
      }
    }
    return null;
  };

  const isAvailableForDate = (emp, date, service) => {
    if (!isEmployeeActiveOnDate(emp, date)) return false;
    const func = state.functions.find((f) => f.id === emp.functionId);
    const allowed = Array.isArray(func?.serviceIds) && func.serviceIds.includes(service.id);
    if (!allowed) return false;
    if (findVacationOnDate(emp, date)) return false;
    if (findSickOnDate(emp, date)) return false;
    if (isNightService(service) && !emp.nightAllowed) return false;
    return true;
  };

  const respectsRestAfterNights = (emp, day) => {
    const { gap, service } = lastAssignmentInfo(emp.id, day, monthKey);
    if (!service || !isNightService(service)) return true;
    const nightStreak = countConsecutiveAssignments(emp.id, day, (svc) => isNightService(svc));
    const requiredRest = nightStreak >= 2 ? rules.restAfterDoubleNight : rules.restAfterNight;
    if (!requiredRest) return true;
    return gap >= requiredRest;
  };

  const canAssign = (emp, day, service) => {
    const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!isAvailableForDate(emp, currentDate, service)) return false;
    const dayAssignments = state.assignments[monthKey][emp.id] || {};
    const locked = state.locks[monthKey]?.[emp.id]?.[day];
    const existing = dayAssignments[day];
    if (locked || existing) return false;
    const previousServiceId = dayAssignments[day - 1];
    const previousService = previousServiceId ? state.services.find((s) => s.id === previousServiceId) : null;
    const nextServiceId = dayAssignments[day + 1];
    const nextService = nextServiceId ? state.services.find((s) => s.id === nextServiceId) : null;
    const isNight = isNightService(service);
    const hadNightYesterday = previousService && isNightService(previousService);
    const hadDayYesterday = previousService && !isNightService(previousService);
    if ((isNight && hadDayYesterday) || (!isNight && hadNightYesterday)) return false;
    if (nextService && isNightService(nextService) !== isNightService(service)) return false;
    const sameServiceStreak = countConsecutiveAssignments(emp.id, day, (svc, sid) => sid === service.id);
    if (sameServiceStreak >= 4) return false;
    const dayStreak = countConsecutiveAssignments(emp.id, day, (svc) => !isNightService(svc));
    const nightStreak = countConsecutiveAssignments(emp.id, day, (svc) => isNightService(svc));
    if (!isNight && dayStreak >= 4) return false;
    if (isNight && nightStreak >= 2) return false;
    if (isNight && !emp.doubleNights && nightStreak >= 1) return false;
    if (!respectsRestAfterNights(emp, day)) return false;
    return true;
  };

  for (let day = 1; day <= days; day++) {
    const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const servicesForDay = getRequiredServicesForDate(currentDate);
    for (const service of servicesForDay) {
      const candidates = rotated
        .filter((emp) => {
          return canAssign(emp, day, service);
        })
        .map((emp) => {
          const locked = state.locks[monthKey]?.[emp.id]?.[day];
          const existing = state.assignments[monthKey][emp.id]?.[day];
          if (locked || existing) return null;
          const targetHours = monthlyTargetHours(emp, currentMonth);
          const projectedHours = hoursForEmployee(monthKey, emp.id) + serviceDuration(service);
          if (targetHours && projectedHours > targetHours + 20) return null;
          const nextNights = countNights(monthKey, emp.id) + (isNightService(service) ? 1 : 0);
          if (rules.maxNights && nextNights > rules.maxNights) return null;
          if (isWeekend(currentDate)) {
            const weekendKey = weekendKeyForDate(currentDate);
            const set = getWeekendSet(emp.id);
            if (weekendKey && !set.has(weekendKey) && set.size >= allowedWorkedWeekends) {
              return null;
            }
          }
          const counts = getCounts(emp.id, service.id);
          const diff = targetHours ? Math.abs(targetHours - projectedHours) : 0;
          const overPenalty = targetHours && projectedHours > targetHours ? projectedHours - targetHours : 0;
          const diversity = counts.service * 2 + counts.total * 0.5;
          const prevAssignment = state.assignments[monthKey][emp.id]?.[day - 1];
          const secondPrevAssignment = state.assignments[monthKey][emp.id]?.[day - 2];
          const nextAssignment = state.assignments[monthKey][emp.id]?.[day + 1];
          const continuityBonus = (prevAssignment ? -4 : 0) + (secondPrevAssignment ? -1 : 0) + (nextAssignment ? -2 : 0);
          let blockPenalty = 0;
          const isNight = isNightService(service);
          if (!isNight) {
            const dayStreak = countConsecutiveAssignments(emp.id, day, (svc) => !isNightService(svc));
            if (dayStreak === 0) blockPenalty += 1;
            if (dayStreak >= 2) blockPenalty -= 1;
            const gap = lastDayServiceGap(emp.id, day);
            if (gap !== null && gap > 2) blockPenalty += 2;
          } else {
            const nightStreak = countConsecutiveAssignments(emp.id, day, (svc) => isNightService(svc));
            if (nightStreak === 0 && day <= 10) blockPenalty += 4;
            else if (nightStreak === 0 && day <= 15) blockPenalty += 2;
            if (nightStreak === 1 && emp.doubleNights) blockPenalty -= 2;
          }

          const weekendBlockPenalty = (() => {
            const dow = currentDate.getDay();
            if (dow === 0) {
              // Sunday should stick to Saturday assignment of the same service
              const saturdayHolder = state.employees.find((candidate) => {
                const assignment = state.assignments[monthKey][candidate.id]?.[day - 1];
                return assignment === service.id;
              });
              if (saturdayHolder && saturdayHolder.id !== emp.id) return 50;
            }
            if (dow === 6) {
              const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day + 1);
              const sundayServices = getRequiredServicesForDate(nextDate);
              const needsPair = sundayServices.some((s) => s.id === service.id);
              if (needsPair) {
                const availableSunday = isAvailableForDate(emp, nextDate, service);
                if (!availableSunday) return 25;
              }
            }
            return 0;
          })();

          const score = diff + overPenalty * 2 + diversity + continuityBonus + blockPenalty + weekendBlockPenalty;
          return { emp, score, counts, projectedHours };
        })
        .filter(Boolean)
        .sort((a, b) => {
          if (a.score !== b.score) return a.score - b.score;
          if (a.counts.service !== b.counts.service) return a.counts.service - b.counts.service;
          return a.counts.total - b.counts.total;
        });

      const choice = candidates[0];
      if (choice) {
        const { emp } = choice;
        if (!state.assignments[monthKey][emp.id]) state.assignments[monthKey][emp.id] = {};
        state.assignments[monthKey][emp.id][day] = service.id;
        incrementCounts(emp.id, service.id);
        if (isWeekend(currentDate)) {
          const weekendKey = weekendKeyForDate(currentDate);
          if (weekendKey) {
            getWeekendSet(emp.id).add(weekendKey);
          }
        }
      }
    }
  }
  const rebalanceRoster = () => {
    const activeEmployees = state.employees.filter((e) => e.status !== 'exited');
    const hoursMap = new Map();
    activeEmployees.forEach((emp) => {
      hoursMap.set(emp.id, {
        target: monthlyTargetHours(emp, currentMonth) || 0,
        current: hoursForEmployee(monthKey, emp.id),
      });
    });
    const sortedReceivers = activeEmployees
      .slice()
      .sort((a, b) => (hoursMap.get(b.id).target - hoursMap.get(b.id).current) - (hoursMap.get(a.id).target - hoursMap.get(a.id).current));
    sortedReceivers.forEach((receiver) => {
      const receiverInfo = hoursMap.get(receiver.id);
      let deficit = (receiverInfo.target || 0) - receiverInfo.current;
      if (deficit <= 0) return;
      for (let day = 1; day <= days && deficit > 0; day++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        if (isWeekend(date)) continue;
        const receiverAssignments = state.assignments[monthKey][receiver.id] || {};
        if (receiverAssignments[day]) continue;
        const donors = activeEmployees
          .filter((donor) => donor.id !== receiver.id)
          .filter((donor) => (state.assignments[monthKey][donor.id] || {})[day])
          .filter((donor) => (hoursMap.get(donor.id)?.current || 0) > (hoursMap.get(donor.id)?.target || 0));
        donors.sort((a, b) => (hoursMap.get(b.id).current - hoursMap.get(b.id).target) - (hoursMap.get(a.id).current - hoursMap.get(a.id).target));
        for (const donor of donors) {
          const donorAssignments = state.assignments[monthKey][donor.id] || {};
          const serviceId = donorAssignments[day];
          const service = state.services.find((s) => s.id === serviceId);
          if (!service) continue;
          if (state.locks[monthKey]?.[donor.id]?.[day] || state.locks[monthKey]?.[receiver.id]?.[day]) continue;
          const projectedReceiver = receiverInfo.current + serviceDuration(service);
          if (receiverInfo.target && projectedReceiver > receiverInfo.target + 4) continue;
          if (!canAssign(receiver, day, service)) continue;
          delete donorAssignments[day];
          state.assignments[monthKey][receiver.id] = receiverAssignments;
          receiverAssignments[day] = serviceId;
          receiverInfo.current = projectedReceiver;
          hoursMap.get(donor.id).current -= serviceDuration(service);
          deficit = (receiverInfo.target || 0) - receiverInfo.current;
          break;
        }
      }
    });
  };
  rebalanceRoster();
  const label = currentMonth.toLocaleDateString('de-AT', { month: 'long', year: 'numeric' });
  state.layout.generatorPivot = rotated.length ? (pivot + 1) % rotated.length : 0;
  appendLog('roster', `Dienstplan für ${label} generiert.`);
  saveState();
  renderRoster();
}

function clearRosterAssignments() {
  const monthKey = getMonthKey(currentMonth);
  ensureMonthMaps(monthKey);
  const days = daysInMonth(currentMonth);
  state.employees.forEach((emp) => {
    const monthAssignments = state.assignments[monthKey]?.[emp.id];
    if (!monthAssignments) return;
    for (let day = 1; day <= days; day++) {
      const locked = state.locks[monthKey]?.[emp.id]?.[day];
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const vacationEntry = findVacationOnDate(emp, date);
      const sickEntry = findSickOnDate(emp, date);
      const keepAssignment =
        locked ||
        (vacationEntry && VACATION_TYPES[vacationEntry.type]?.clearsAssignments === false) ||
        (sickEntry && SICK_TYPES[sickEntry.kind]?.clearsAssignments === false);
      if (!keepAssignment) {
        delete monthAssignments[day];
      }
    }
    if (!Object.keys(monthAssignments).length) {
      delete state.assignments[monthKey][emp.id];
    }
  });
  appendLog('roster', 'Dienstplan für den Monat geleert.', monthKey);
  saveState();
  renderRoster();
}

function syncEmploymentHours() {
  employmentPercentSelect.addEventListener('change', () => {
    const selected = state.employment.find((e) => e.id === employmentPercentSelect.value);
    if (selected) {
      employmentHoursSelect.value = selected.id;
    }
  });
}

function handleEmployeePickerChange() {
  const id = employeePicker.value;
  if (!id) {
    editing.employee = null;
    employeeForm.reset();
    renderVacationPanel(null);
    renderSickPanel(null);
    if (employeeExitBtn) employeeExitBtn.disabled = true;
    return;
  }
  const emp = state.employees.find((e) => e.id === id);
  if (emp) {
    editing.employee = id;
    fillEmployeeForm(emp);
    renderVacationPanel(emp);
    renderSickPanel(emp);
  }
}

function handleServicePickerChange() {
  const id = servicePicker.value;
  if (!id) {
    editing.service = null;
    serviceForm.reset();
    return;
  }
  const service = state.services.find((s) => s.id === id);
  if (service) {
    editing.service = id;
    fillServiceForm(service);
  }
}

function handleFunctionPickerChange() {
  const id = functionPicker.value;
  if (!id) {
    editing.function = null;
    functionForm.reset();
    renderFunctionServiceChoices([]);
    return;
  }
  const func = state.functions.find((f) => f.id === id);
  if (func) {
    editing.function = id;
    fillFunctionForm(func);
  }
}

function handleEmploymentPickerChange() {
  const id = employmentPicker.value;
  if (!id) {
    editing.employment = null;
    employmentForm.reset();
    return;
  }
  const entry = state.employment.find((e) => e.id === id);
  if (entry) {
    editing.employment = id;
    fillEmploymentForm(entry);
  }
}

function handleTicketSubmit(event) {
  event.preventDefault();
  if (!canCreateTickets()) {
    showNotification('Keine Berechtigung zum Erstellen', 'error');
    return;
  }
  autoFillTicketReporterEmail(true);
  const name = (ticketNameInput?.value || '').trim();
  const priority = ticketPriorityInput?.value || TICKET_PRIORITIES[1];
  const area = ticketAreaInput?.value || AREAS[0];
  const description = ticketDescriptionInput?.value || '';
  const reporterName = (ticketReporterInput?.value || 'Alois Reichsöllner').trim();
  const reporterEmail = (ticketReporterEmailInput?.value || '').trim();
  if (!name) {
    showNotification('Fehler beim Speichern', 'error');
    return;
  }
  const ticket = {
    id: uuid(),
    ticketNumber: generateTicketNumber(),
    name,
    priority: TICKET_PRIORITIES.includes(priority) ? priority : TICKET_PRIORITIES[1],
    area,
    description,
    status: TICKET_STATUSES[0],
    reporterName: reporterName || 'Alois Reichsöllner',
    reporterEmail,
    createdAt: new Date().toISOString(),
    assignee: '',
    updates: [
      {
        id: uuid(),
        status: TICKET_STATUSES[0],
        note: 'Ticket erstellt',
        timestamp: new Date().toISOString(),
        notify: false,
      },
    ],
  };
  state.tickets = [ticket, ...(state.tickets || [])];
  appendLog('tickets', `Neues Ticket '${ticket.name}' erfasst.`, ticket.id);
  saveState();
  if (ticketForm) ticketForm.reset();
  if (ticketPriorityInput) ticketPriorityInput.value = 'mittel';
  if (ticketStatusFilter) ticketStatusFilter.value = 'all';
  if (ticketReporterInput) ticketReporterInput.value = 'Alois Reichsöllner';
  renderTickets();
  showScreen('tickets');
  showNotification('Eintrag erfolgreich gespeichert', 'success');
}

function handleTicketFilterChange() {
  renderTickets();
}

function handleTicketCardAction(event) {
  const button = event.target.closest('button[data-ticket-submit]');
  if (!button) return;
  if (!canManageTickets()) {
    showNotification('Keine Berechtigung zum Aktualisieren', 'error');
    return;
  }
  const ticketId = button.dataset.ticketSubmit;
  const ticket = state.tickets.find((t) => t.id === ticketId);
  if (!ticket) return;
  const card = button.closest('[data-ticket-id]');
  const statusSelect = card?.querySelector(`select[data-ticket-status="${ticketId}"]`);
  const noteField = card?.querySelector(`textarea[data-ticket-note="${ticketId}"]`);
  const notifyField = card?.querySelector(`input[data-ticket-notify="${ticketId}"]`);
  const status = statusSelect && TICKET_STATUSES.includes(statusSelect.value) ? statusSelect.value : ticket.status;
  const note = (noteField?.value || '').trim();
  const notify = !!notifyField?.checked;
  const previousStatus = ticket.status;
  const timestamp = new Date().toISOString();
  const timestampLabel = new Date(timestamp).toLocaleString('de-AT', { dateStyle: 'short', timeStyle: 'short' });
  let autoNote = 'Aktualisiert';
  if (status === 'in Bearbeitung' && previousStatus !== 'in Bearbeitung') {
    autoNote = `Bearbeitung übernommen durch Hans Maier am ${timestampLabel}`;
  } else if (status === 'Geschlossen' && previousStatus !== 'Geschlossen') {
    autoNote = `Ticket abgeschlossen am ${timestampLabel}`;
  } else if (status !== previousStatus) {
    autoNote = `Status geändert: ${previousStatus} → ${status} (${timestampLabel})`;
  }
  const entry = {
    id: uuid(),
    status,
    note: note || autoNote,
    timestamp,
    notify,
  };
  ticket.status = status;
  if (status === 'in Bearbeitung') {
    ticket.assignee = 'Hans Maier';
    ticket.assignedAt = timestamp;
  }
  ticket.closedAt = status === 'Geschlossen' ? timestamp : status === previousStatus ? ticket.closedAt || '' : '';
  ticket.updates = [entry, ...(ticket.updates || [])].slice(0, 100);
  appendLog('tickets', `Ticket '${ticket.name}' auf '${status}' aktualisiert.`, ticket.id);
  saveState();
  if (noteField) noteField.value = '';
  if (notifyField) notifyField.checked = false;
  updateTicketActionLabel(card);
  renderTickets();
  showNotification('Änderung erfolgreich gespeichert', 'success');
  if (notify && ticket.reporterEmail) {
    alert(
      `E-Mail an ${ticket.reporterName || 'Einmelder'} (${ticket.reporterEmail}):\n${ticket.name}\nStatus: ${status}\n${note || 'Kein zusätzlicher Text'}`
    );
  }
}

function wireEvents() {
  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
  menuButtons.forEach((btn) => btn.addEventListener('click', () => showScreen(btn.dataset.target)));
  employeeForm.addEventListener('submit', handleEmployeeForm);
  employeeForm.addEventListener('reset', handleEmployeeFormReset);
  if (employeeExitBtn) employeeExitBtn.addEventListener('click', handleEmployeeExit);
  if (employeeList) employeeList.addEventListener('click', handleEmployeeListClick);
  serviceForm.addEventListener('submit', handleServiceForm);
  functionForm.addEventListener('submit', handleFunctionForm);
  functionForm.addEventListener('reset', () => {
    editing.function = null;
    renderFunctionServiceChoices([]);
  });
  if (functionList) functionList.addEventListener('click', handleFunctionListClick);
  employmentForm.addEventListener('submit', handleEmploymentForm);
  rulesForm.addEventListener('submit', handleRulesForm);
  rosterTable.addEventListener('change', handleRosterChange);
  rosterTable.addEventListener('click', handleRosterClick);
  rosterTable.addEventListener('dragstart', handleRowDragStart);
  rosterTable.addEventListener('dragover', handleRowDragOver);
  rosterTable.addEventListener('drop', handleRowDrop);
  rosterTable.addEventListener('dragend', handleRowDragEnd);
  employeePicker.addEventListener('change', handleEmployeePickerChange);
  servicePicker.addEventListener('change', handleServicePickerChange);
  functionPicker.addEventListener('change', handleFunctionPickerChange);
  employmentPicker.addEventListener('change', handleEmploymentPickerChange);
  prevMonthBtn.addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderRoster();
    renderEmployees();
  });
  nextMonthBtn.addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderRoster();
    renderEmployees();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      currentMonth.setMonth(currentMonth.getMonth() - 1);
      renderRoster();
      renderEmployees();
    }
    if (e.key === 'ArrowRight') {
      currentMonth.setMonth(currentMonth.getMonth() + 1);
      renderRoster();
      renderEmployees();
    }
  });
  generateBtn.addEventListener('click', () => {
    if (!canEditRoster()) {
      showNotification('Keine Berechtigung zum Generieren', 'error');
      return;
    }
    if (confirm('Dienstplan automatisch generieren?')) {
      generateRoster();
      showNotification('Dienstplan erfolgreich generiert', 'success');
    }
  });
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (!canEditRoster()) {
        showNotification('Keine Berechtigung', 'error');
        return;
      }
      if (confirm('Dienstplan-Einträge für diesen Monat leeren? Urlaube, Krankenstände und gesperrte Tage bleiben erhalten.')) {
        clearRosterAssignments();
        showNotification('Dienstplan bereinigt', 'success');
      }
    });
  }
  saveFileBtn.addEventListener('click', downloadStateFile);
  loadFileBtn.addEventListener('click', () => loadFileInput.click());
  loadFileInput.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then(importState).finally(() => {
      loadFileInput.value = '';
    });
  });
  if (addVacationBtn) addVacationBtn.addEventListener('click', handleAddVacation);
  if (vacationTypeSelect) vacationTypeSelect.addEventListener('change', updateVacationReasonVisibility);
  if (vacationList) vacationList.addEventListener('click', handleVacationListClick);
  if (addSickBtn) addSickBtn.addEventListener('click', handleAddSick);
  if (sickList) {
    sickList.addEventListener('click', handleSickListClick);
    sickList.addEventListener('change', handleSickListChange);
  }
  if (vacationLimitForm) vacationLimitForm.addEventListener('submit', handleVacationLimitSubmit);
  if (vacationLimitList) vacationLimitList.addEventListener('click', handleVacationLimitListClick);
  if (themeToggle) {
    themeToggle.addEventListener('click', () => applyTheme(currentTheme === 'light' ? 'dark' : 'light'));
  }
  if (rosterModeButtons.length) {
    rosterModeButtons.forEach((btn) => {
      btn.addEventListener('click', () => setRosterMode(btn.dataset.rosterMode || 'edit'));
    });
  }
  if (printPlanBtn) {
    printPlanBtn.addEventListener('click', handlePrintPlan);
  }
  if (createGroupBtn) createGroupBtn.addEventListener('click', handleCreateGroup);
  if (assignGroupBtn) assignGroupBtn.addEventListener('click', handleAssignGroup);
  if (removeGroupBtn) removeGroupBtn.addEventListener('click', handleRemoveGroup);
  if (groupSelect) groupSelect.addEventListener('change', updateRowToolStates);
  if (ticketForm) ticketForm.addEventListener('submit', handleTicketSubmit);
  if (ticketForm) ticketForm.addEventListener('reset', () => {
    if (ticketPriorityInput) ticketPriorityInput.value = 'mittel';
    if (ticketReporterInput) ticketReporterInput.value = 'Alois Reichsöllner';
    autoFillTicketReporterEmail(true);
    if (ticketAreaInput) ticketAreaInput.value = AREAS[0];
  });
  if (ticketStatusFilter) ticketStatusFilter.addEventListener('change', handleTicketFilterChange);
  if (ticketList) {
    ticketList.addEventListener('click', handleTicketCardAction);
    ticketList.addEventListener('change', handleTicketCardChange);
  }
  syncEmploymentHours();
}

function handlePrintPlan() {
  if (typeof window === 'undefined') return;
  if (rosterMode !== 'view') {
    modeBeforePrint = rosterMode;
    setRosterMode('view');
  } else {
    modeBeforePrint = null;
  }
  window.print();
}

function init() {
  applyTheme(currentTheme);
  updateDropdowns();
  if (loginStatus) loginStatus.textContent = 'Bitte einloggen.';
  if (employeeExitBtn) employeeExitBtn.disabled = true;
  updateExitedEmployees();
  renderEmployees();
  renderServices();
  renderFunctions();
  renderEmployment();
  setupWeekdayInteractions();
  renderRules();
  renderRoster();
  renderLogs();
  updateVacationReasonVisibility();
  renderTickets();
  wireEvents();
  autoLoginDefaultUser();
  applyPermissions();
}

if (typeof window !== 'undefined') {
  window.addEventListener('afterprint', () => {
    if (modeBeforePrint) {
      const restore = modeBeforePrint;
      modeBeforePrint = null;
      setRosterMode(restore);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
