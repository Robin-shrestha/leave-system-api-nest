import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateCountryDto } from '../country/dto/create-country.dto';
import { CreateHolidayDto } from '../holidays/dto/create-holiday.dto';
import { CreateLeaveTypeDto } from '../leave-types/dto/create-leave-type.dto';
import { CreateFiscalYearDto } from '../fiscal-year/dto/create-fiscal-year.dto';
import { CreateLeavePolicyDto } from '../leave-policy/dto/create-leave-policy.dto';
import { CreateUserLeaveDto } from '../user-leave/dto/create-user-leave.dto';

export type SeedCountryDTO = CreateCountryDto;
export type SeedLeaveTypeDTO = CreateLeaveTypeDto;
export type SeedFiscalYearDto = CreateFiscalYearDto;

export type SeedHolidayDto = Omit<CreateHolidayDto, 'fiscalYearId'> & {
  countryCode: string;
  fiscalYear: string;
};

export type SeedLeavePolicyDTO = Omit<
  CreateLeavePolicyDto,
  'fiscalYearId' | 'leaveTypeId'
> & {
  countryCode: string;
  fiscalYear: string;
  leaveType: string;
};

export type SeedUsersDTO = CreateUserDto;

export type SeedUserLeaveDto = Pick<CreateUserLeaveDto, 'additionalDays'>;

export type SeedData = {
  countries: SeedCountryDTO[];
  leaveTypes: SeedLeaveTypeDTO[];
  fiscalYears: SeedFiscalYearDto[];
  holidays: SeedHolidayDto[];
  leavePolicies: SeedLeavePolicyDTO[];
  users: SeedUsersDTO[];
};
