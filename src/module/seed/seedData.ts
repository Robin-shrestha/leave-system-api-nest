import {
  SeedCountryDTO,
  SeedData,
  SeedFiscalYearDto,
  SeedHolidayDto,
  SeedLeavePolicyDTO,
  SeedLeaveTypeDTO,
  SeedUsersDTO,
} from './seed.types';
import { Gender, Role } from '../../types/enums';

const DEFAULT_COUNTRY_CODE = 'NP';
const DEFAULT_FISCAL_YEAR = '24/25';

const countries: SeedCountryDTO[] = [
  { countryName: 'Nepal', countryCode: DEFAULT_COUNTRY_CODE },
  { countryName: 'USA', countryCode: 'US' },
  { countryName: 'India', countryCode: 'IN' },
];

const leaveTypes: SeedLeaveTypeDTO[] = [
  {
    type: 'Discretionary',
    description: 'Discretionary common leave',
  },
  {
    type: 'Sick Leave',
    description: 'Leave when sick',
  },
  {
    type: 'Mensuration leave',
    description: 'only available for the ladies',
    affectedGender: Gender.FEMALE,
  },
  {
    type: 'Compensatory Leave',
  },
];

const fiscalYears: SeedFiscalYearDto[] = [
  {
    countryCode: DEFAULT_COUNTRY_CODE,
    startDate: '2022-05-05',
    endDate: '2023-05-04',
    fiscalYear: '22/23',
  },
  {
    countryCode: DEFAULT_COUNTRY_CODE,
    startDate: '2023-05-05',
    endDate: '2024-05-04',
    fiscalYear: '23/24',
  },
  {
    countryCode: DEFAULT_COUNTRY_CODE,
    startDate: '2024-05-05',
    endDate: '2025-05-04',
    fiscalYear: DEFAULT_FISCAL_YEAR,
  },
];

const holidays: SeedHolidayDto[] = [
  {
    date: '2024-08-05',
    name: 'Dashain 1',
    countryCode: DEFAULT_COUNTRY_CODE,
    fiscalYear: DEFAULT_FISCAL_YEAR,
  },
  {
    date: '2024-07-25',
    name: 'Dashain 2',
    countryCode: DEFAULT_COUNTRY_CODE,
    fiscalYear: DEFAULT_FISCAL_YEAR,
  },
  {
    date: '2024-11-19',
    name: 'Dashain 3',
    countryCode: DEFAULT_COUNTRY_CODE,
    fiscalYear: DEFAULT_FISCAL_YEAR,
  },
];

const leavePolicies: SeedLeavePolicyDTO[] = leaveTypes.map((item, index) => ({
  count: 10,
  countryCode: DEFAULT_COUNTRY_CODE,
  fiscalYear: DEFAULT_FISCAL_YEAR,
  leaveType: item.type,
  cashable: index % 2 === 0,
  maxTransferable: index % 2 === 0 ? 5 : 0,
}));

const users: SeedUsersDTO[] = [
  {
    username: 'Ridiculus Muskrat',
    phone: '(511) 510-0573',
    email: 'ridiculus.ridiculus@outlook.ca',
    address: 'Ap #587-5403 Faucibus Av.',
    role: Role.ADMIN,
    designation: 'Software Engineer',
    countryCode: 'NP',
    dateOfBirth: '2000-10-10',
    gender: Gender.MALE,
  },
  {
    username: 'Adam Hahn',
    phone: '(336) 608-7893',
    email: 'montes.nascetur@hotmail.edu',
    address: 'Ap #812-9878 Convallis Av.',
    role: Role.MANAGER,
    designation: 'Software Engineer',
    countryCode: 'US',
    dateOfBirth: '2000-10-11',
    gender: Gender.MALE,
  },
  {
    username: 'Sophia Beck',
    phone: '1-765-672-0995',
    email: 'elit@icloud.ca',
    address: 'Ap #300-9086 Imperdiet Avenue',
    role: Role.USER,
    designation: 'Software Engineer',
    countryCode: 'NP',
    dateOfBirth: '2000-02-10',
    gender: Gender.FEMALE,
  },
  {
    username: 'Cassady Carrillo',
    phone: '(157) 746-6487',
    email: 'convallis@hotmail.couk',
    address: 'Ap #884-4114 Egestas St.',
    role: Role.USER,
    designation: 'Software Engineer',
    countryCode: 'NP',
    dateOfBirth: '2000-10-21',
    gender: Gender.FEMALE,
  },
  {
    username: 'Burton Ray',
    phone: '1-733-827-3324',
    email: 'faucibus.leo.in@hotmail.org',
    address: '908-9050 At St.',
    role: Role.USER,
    designation: 'Software Engineer',
    countryCode: 'NP',
    dateOfBirth: '1998-10-16',
    gender: Gender.OTHERS,
  },
];

export const defaultSeedData: SeedData = {
  countries,
  leaveTypes,
  fiscalYears,
  holidays,
  leavePolicies,
  users,
};
