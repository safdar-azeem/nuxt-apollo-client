import gql from 'graphql-tag';

import {
  useQuery as apolloUseQuery,
  useMutation,
  useLazyQuery,
  useSubscription,
  DefaultApolloClient,
  ApolloClients,
  useApolloClient,
  provideApolloClient,
  provideApolloClients,
    useQueryLoading,
  useGlobalQueryLoading,
  useMutationLoading,
  useGlobalMutationLoading,
  useSubscriptionLoading,
  useGlobalSubscriptionLoading,
  useResult,
} from "@vue/apollo-composable";

import type {
  UseQueryOptions,
  UseQueryReturn,
  UseMutationReturn,
  UseMutationOptions, 
  MutateFunction,
  MutateOverrideOptions,
  MutateResult,
  UseSubscriptionOptions,
  UseSubscriptionReturn,
  UseResultReturn,
  UseApolloClientReturn,
} from "@vue/apollo-composable";

import { useNuxtApp } from "#app";
import {ref} from "vue";
   

const defaultResult = () => {
  const result = ref({});
  const loading = ref(false);
  const error = ref(null);

  return {
    result,
    loading,
    error,
    onResult: (callback) => {
      callback?.(result.value);
    },
    onError: (callback) => {
      callback?.(error.value);
    },
    start: () => {},
    stop: () => {},
    restart: () => {},
    refetch: () => {},
    onCompleted: () => {},
  };
};

const useSSRQuery = async (document, variables, options) => {
  const context = useNuxtApp();

  const clientId =
    options?.clientId ||
    Object.keys(context.$apolloClients)["default"] ||
    Object.keys(context.$apolloClients)[0];

  const apolloClient = context.$apolloClients[clientId];

  try {
    const { data } = await apolloClient.query({
      query: document,
      variables,
      ...options,
    });

    const result = ref(data);
    const loading = ref(false);
    const error = ref(null);

    const onResult = (callback) => {
      callback(result.value);
    };

    const onError = (callback) => {
      callback(error.value);
    };

    return { ...defaultResult(), result, loading, error, onResult, onError };
  } catch (error) {      
    const errorRef = ref(error);

    const onError = (callback) => {
      callback(error.value);
    };

    return {
      ...defaultResult(),
      error: errorRef,
      onError,
    };
  }
};  

const useQuery = <TResult = any, TVariables = any>(
  document,
  variables,
  options
): UseQueryReturn<TResult, TVariables> => {
  if (process.server) {
    return useSSRQuery(document, variables, options) as any;
  }
  return apolloUseQuery<TResult, TVariables>(document, variables, options);
};

                      
import type * as VueCompositionApi from 'vue';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type ReactiveFunction<TParam> = () => TParam;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  JSON: { input: any; output: any; }
  ObjectId: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export enum IAccountType {
  Current = 'current',
  Salary = 'salary',
  Savings = 'savings'
}

export type IAdmin = {
  _id: Scalars['ID']['output'];
  avatar?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  role: IAdminRole;
};

export enum IAdminRole {
  Admin = 'admin',
  Finance = 'finance',
  SuperAdmin = 'superAdmin',
  Support = 'support'
}

export type IAllEnterpriseJobsResponse = {
  enterprise?: Maybe<Array<Maybe<IEnterpriseJob>>>;
  pageInfo: IPaginationInfo;
};

export type IApp = {
  _id: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
  monthlyPrice: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  stripeMonthlyPriceId: Scalars['String']['output'];
  stripeYearlyPriceId: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
  yearlyPrice: Scalars['Int']['output'];
};

export type IAppInput = {
  _id: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  stripeMonthlyPriceId: Scalars['String']['input'];
  stripeYearlyPriceId: Scalars['String']['input'];
};

export type IAppointment = {
  _id: Scalars['ID']['output'];
  amount: Scalars['Float']['output'];
  createdAt: Scalars['Date']['output'];
  createdBy: IUser;
  createdByType: ICreatedByType;
  customer: IUser;
  date: Scalars['Int']['output'];
  endTime: Scalars['String']['output'];
  locationAddress?: Maybe<Scalars['String']['output']>;
  meetingLink?: Maybe<Scalars['String']['output']>;
  meetingLocation?: Maybe<IMeetingLocation>;
  month: Scalars['Int']['output'];
  servent?: Maybe<IUser>;
  service: IService;
  startTime: Scalars['String']['output'];
  status: IAppointmentStatus;
  updatedAt: Scalars['Date']['output'];
  year: Scalars['Int']['output'];
};

export type IAppointmentInput = {
  customer: Scalars['ID']['input'];
  date: Scalars['Int']['input'];
  endTime: Scalars['String']['input'];
  locationAddress?: InputMaybe<Scalars['String']['input']>;
  meetingLink?: InputMaybe<Scalars['String']['input']>;
  meetingLocation: IMeetingLocation;
  month: Scalars['Int']['input'];
  servent?: InputMaybe<Scalars['ID']['input']>;
  service: Scalars['ID']['input'];
  startTime: Scalars['String']['input'];
  status?: InputMaybe<IAppointmentStatus>;
  year: Scalars['Int']['input'];
};

export enum IAppointmentStatus {
  Canceled = 'canceled',
  Completed = 'completed',
  Confirmed = 'confirmed',
  Scheduled = 'scheduled'
}

export type IAppreciation = {
  _id?: Maybe<Scalars['ObjectId']['output']>;
  award?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['ObjectId']['output']>;
  employee: IUser;
  rating?: Maybe<Scalars['Float']['output']>;
  reviewer: IUser;
  reviewerType?: Maybe<Scalars['String']['output']>;
  summary?: Maybe<Scalars['String']['output']>;
};

export type IAppreciationInput = {
  award?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['ObjectId']['input']>;
  employee?: InputMaybe<Scalars['ObjectId']['input']>;
  rating?: InputMaybe<Scalars['Float']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
};

export enum IApps {
  Crm = 'crm',
  Hrm = 'hrm',
  Pos = 'pos',
  Product = 'product',
  Purchase = 'purchase',
  Recruitment = 'recruitment',
  Sale = 'sale',
  Services = 'services',
  Web = 'web'
}

export type IAttendance = {
  _id: Scalars['ObjectId']['output'];
  checkInTime?: Maybe<Scalars['Date']['output']>;
  checkOutTime?: Maybe<Scalars['Date']['output']>;
  date: Scalars['Int']['output'];
  employee: IUser;
  month?: Maybe<Scalars['Int']['output']>;
  overTime?: Maybe<Scalars['Float']['output']>;
  overTimeStatus?: Maybe<IOverTimeStatusEnum>;
  status?: Maybe<IAttendanceStatus>;
  totalHoursWorked?: Maybe<Scalars['Float']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

export enum IAttendanceStatus {
  Absent = 'absent',
  OnLeave = 'onLeave',
  Present = 'present'
}

export type IAuthData = {
  isVerified: Scalars['Boolean']['output'];
  token: Scalars['String']['output'];
};

export type IAuthDataInput = {
  isVerified: Scalars['Boolean']['input'];
  token: Scalars['String']['input'];
};

export type IAuthResendOtpResponse = {
  isVerified: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type IAuthVerifyOtpResponse = {
  isVerified: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type IAvailableHours = {
  endTime: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
};

export type IAvailableHoursInput = {
  endTime: Scalars['String']['input'];
  startTime: Scalars['String']['input'];
};

export type IBankAccount = {
  accountIBAN?: Maybe<Scalars['String']['output']>;
  accountNumber: Scalars['String']['output'];
  accountTitle: Scalars['String']['output'];
  bankName: Scalars['String']['output'];
};

export type IBankAccountInput = {
  accountIBAN?: InputMaybe<Scalars['String']['input']>;
  accountNumber: Scalars['String']['input'];
  accountTitle: Scalars['String']['input'];
  bankName: Scalars['String']['input'];
};

export enum IBillingCycle {
  Monthly = 'monthly',
  Yearly = 'yearly'
}

export type IBranch = {
  _id: Scalars['ID']['output'];
  address?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  employees?: Maybe<Array<Scalars['ID']['output']>>;
  manager?: Maybe<IUser>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  posTerminals?: Maybe<Array<Scalars['ID']['output']>>;
};

export type IBreakTime = {
  endTime: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
};

export type IBreakTimeInput = {
  endTime: Scalars['String']['input'];
  startTime: Scalars['String']['input'];
};

export type IBusinessHours = {
  endTime: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
};

export type IBusinessHoursInput = {
  endTime: Scalars['String']['input'];
  startTime: Scalars['String']['input'];
};

export type ICompanyPolicy = {
  description?: Maybe<Scalars['String']['output']>;
  documentUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type ICompanyPolicyInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  documentUrl?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type IContact = {
  _id?: Maybe<Scalars['ObjectId']['output']>;
  avatar?: Maybe<Scalars['String']['output']>;
  companyName?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  createdBy: IUser;
  customer?: Maybe<Scalars['ID']['output']>;
  email: Scalars['String']['output'];
  industry?: Maybe<Scalars['String']['output']>;
  jobTitle?: Maybe<Scalars['String']['output']>;
  location?: Maybe<ILocation>;
  name: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  socialMedia?: Maybe<Array<Maybe<ICustomField>>>;
  source?: Maybe<IContactSource>;
  updatedAt: Scalars['String']['output'];
};

export type IContactInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  customer?: InputMaybe<Scalars['ID']['input']>;
  email: Scalars['String']['input'];
  industry?: InputMaybe<Scalars['String']['input']>;
  jobTitle?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<ILocationInput>;
  name: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  socialMedia?: InputMaybe<Array<InputMaybe<ICustomFieldInput>>>;
  source?: InputMaybe<IContactSource>;
};

export enum IContactSource {
  Event = 'event',
  Other = 'other',
  Referral = 'referral',
  Website = 'website'
}

export type IContacts = {
  Youtube?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  instagram?: Maybe<Scalars['String']['output']>;
  linkedIn?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  twitter?: Maybe<Scalars['String']['output']>;
};

export type IContactsInput = {
  Youtube?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  instagram?: InputMaybe<Scalars['String']['input']>;
  linkedIn?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  twitter?: InputMaybe<Scalars['String']['input']>;
};

export type ICountry = {
  _id: Scalars['ObjectId']['output'];
  currency?: Maybe<Scalars['String']['output']>;
  currencyCode?: Maybe<Scalars['String']['output']>;
  currencySymbol?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type ICountryInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
  currencyCode?: InputMaybe<Scalars['String']['input']>;
  currencySymbol?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type ICreateAdminInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  role: IAdminRole;
};

export type ICreateBranchInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  employees?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  manager?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  posTerminals?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type ICreateCustomerRfqInput = {
  customer?: InputMaybe<Scalars['ID']['input']>;
  dueDate: Scalars['Date']['input'];
  products: Array<ICustomerRfqProductInput>;
  totalAmount: Scalars['Float']['input'];
};

export type ICreatePosOrderInput = {
  cardAmount: Scalars['Float']['input'];
  cashAmount: Scalars['Float']['input'];
  customer?: InputMaybe<Scalars['ID']['input']>;
  onlineAmount: Scalars['Float']['input'];
  posRegister: Scalars['ID']['input'];
  products: Array<IPosOrderProductInput>;
  totalAmount: Scalars['Float']['input'];
  totalDiscount: Scalars['Float']['input'];
  totalTax: Scalars['Float']['input'];
};

export type ICreatePosRegisterInput = {
  creditSales?: InputMaybe<Scalars['Float']['input']>;
  posTerminal: Scalars['ID']['input'];
  totalExpense?: InputMaybe<Scalars['Float']['input']>;
  totalPayment: Scalars['Float']['input'];
  totalRefund?: InputMaybe<Scalars['Float']['input']>;
  totalSales?: InputMaybe<Scalars['Float']['input']>;
};

export type ICreatePosReturnInput = {
  originalOrder: Scalars['ID']['input'];
  products: Array<IPosReturnProductInput>;
  totalReturnAmount: Scalars['Float']['input'];
};

export type ICreatePosTerminalInput = {
  branch: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  operator?: InputMaybe<Scalars['ID']['input']>;
};

export type ICreatePurchaseOrderPaymentInput = {
  amountPaid: Scalars['Float']['input'];
  paymentDate?: InputMaybe<Scalars['Date']['input']>;
  paymentMethod: IPaymentMethod;
  paymentNote?: InputMaybe<Scalars['String']['input']>;
  purchaseOrder: Scalars['ID']['input'];
};

export type ICreatePurchaseReceivedInput = {
  attachment?: InputMaybe<Scalars['String']['input']>;
  products: Array<IPurchaseReceivedProductInput>;
  purchaseOrder: Scalars['ID']['input'];
  receivedDate?: InputMaybe<Scalars['Date']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<IPurchaseReceivedStatus>;
  supplier: Scalars['ID']['input'];
  totals: IProductTotalsInput;
};

export type ICreatePurchaseReturnInput = {
  attachment?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  products: Array<IPurchaseReturnProductInput>;
  purchaseReceived: Scalars['ID']['input'];
  totalAmount: Scalars['Float']['input'];
};

export type ICreateRfqInput = {
  dueDate: Scalars['Date']['input'];
  products?: InputMaybe<Array<InputMaybe<IRfqProductsInupt>>>;
  suppliers: Array<Scalars['ID']['input']>;
};

export type ICreateSaleOrderPaymentInput = {
  amountPaid: Scalars['Float']['input'];
  paymentDate?: InputMaybe<Scalars['Date']['input']>;
  paymentMethod: IPaymentMethod;
  paymentNote?: InputMaybe<Scalars['String']['input']>;
  salesOrder: Scalars['ID']['input'];
};

export type ICreateSaleQuotationInput = {
  attachment?: InputMaybe<Scalars['String']['input']>;
  customer: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  products: Array<ISaleQuotationProductInput>;
  rfq?: InputMaybe<Scalars['ID']['input']>;
  totals: IProductTotalsInput;
  validityDate: Scalars['Date']['input'];
};

export type ICreateSalesOrderInput = {
  attachment?: InputMaybe<Scalars['String']['input']>;
  billingAddress: Scalars['String']['input'];
  customer: Scalars['ID']['input'];
  deliveryDate?: InputMaybe<Scalars['Date']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  orderDate?: InputMaybe<Scalars['Date']['input']>;
  paymentTerms?: InputMaybe<Scalars['String']['input']>;
  products: Array<ISalesOrderProductInput>;
  quotation?: InputMaybe<Scalars['ID']['input']>;
  shippingAddress: Scalars['String']['input'];
  totals: IProductTotalsInput;
};

export type ICreateSalesReturnInput = {
  attachment?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  products: Array<ISalesReturnProductInput>;
  salesOrder: Scalars['ID']['input'];
  totalAmount: Scalars['Float']['input'];
};

export type ICreateSubScriptionAppInput = {
  appId: Scalars['String']['input'];
  stripePriceId: Scalars['String']['input'];
};

export type ICreateSubscriptionByAdminInput = {
  apps: Array<Scalars['String']['input']>;
  billingCycle: IBillingCycle;
  branchesLimits: Scalars['Int']['input'];
  packageID?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Float']['input'];
  title: Scalars['String']['input'];
  usersLimits: Scalars['Int']['input'];
};

export enum ICreatedByType {
  Customer = 'Customer',
  Employee = 'Employee',
  Enterprise = 'Enterprise',
  Supplier = 'Supplier'
}

export type ICustomField = {
  label?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
  valueType?: Maybe<Scalars['String']['output']>;
};

export type ICustomFieldInput = {
  label?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
  valueType?: InputMaybe<Scalars['String']['input']>;
};

export type ICustomer = {
  _id: Scalars['ID']['output'];
  allowLogin?: Maybe<Scalars['Boolean']['output']>;
  avatar?: Maybe<Scalars['String']['output']>;
  contacts?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  createdAt: Scalars['String']['output'];
  createdBy?: Maybe<IUser>;
  email: Scalars['String']['output'];
  gender?: Maybe<IGender>;
  industry?: Maybe<Scalars['String']['output']>;
  isWalkIn?: Maybe<Scalars['Boolean']['output']>;
  location?: Maybe<ILocation>;
  mobileNumber?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  objective?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  shippingAddress?: Maybe<ILocation>;
  stats?: Maybe<IPaymentPaidStats>;
  status?: Maybe<ICustomerStatus>;
  updatedAt: Scalars['String']['output'];
  userName: Scalars['String']['output'];
};

export type ICustomerInput = {
  allowLogin?: InputMaybe<Scalars['Boolean']['input']>;
  avatar?: InputMaybe<Scalars['String']['input']>;
  contacts?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  email: Scalars['String']['input'];
  industry?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<ILocationInput>;
  mobileNumber?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  objective?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  shippingAddress?: InputMaybe<ILocationInput>;
  status?: InputMaybe<ICustomerStatus>;
  userName: Scalars['String']['input'];
};

export type ICustomerRfq = {
  _id: Scalars['ID']['output'];
  createdAt: Scalars['Date']['output'];
  createdBy: Scalars['ID']['output'];
  createdByType: ICreatedByType;
  customer: IUser;
  dueDate: Scalars['Date']['output'];
  isActive: Scalars['Boolean']['output'];
  products: Array<ICustomerRfqProduct>;
  rfqNumber: Scalars['String']['output'];
  status: ICustomerRfqStatus;
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type ICustomerRfqProduct = {
  product: IProduct;
  quantity: Scalars['Int']['output'];
  size?: Maybe<Scalars['String']['output']>;
};

export type ICustomerRfqProductInput = {
  product: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  size?: InputMaybe<Scalars['String']['input']>;
};

export enum ICustomerRfqStatus {
  Approved = 'approved',
  Pending = 'pending',
  Rejected = 'rejected'
}

export enum ICustomerStatus {
  Active = 'active',
  Inactive = 'inactive'
}

export type IDepartment = {
  _id: Scalars['ID']['output'];
  apps?: Maybe<Array<Maybe<IApps>>>;
  description?: Maybe<Scalars['String']['output']>;
  employees?: Maybe<Array<Maybe<IUser>>>;
  manager?: Maybe<IUser>;
  name: Scalars['String']['output'];
  permissions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type IDepartmentInput = {
  apps?: InputMaybe<Array<InputMaybe<IApps>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  employeeIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  managerId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  permissions: Array<InputMaybe<Scalars['String']['input']>>;
};

export type IEmergencyContact = {
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  relationship: Scalars['String']['output'];
};

export type IEmergencyContactInput = {
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  relationship: Scalars['String']['input'];
};

export type IEmployee = {
  _id: Scalars['ObjectId']['output'];
  allowLogin: Scalars['Boolean']['output'];
  apps?: Maybe<Array<Maybe<IApps>>>;
  attendanceRecords?: Maybe<Array<Maybe<IAttendance>>>;
  avatar?: Maybe<Scalars['String']['output']>;
  bankDetails?: Maybe<IBankAccount>;
  branch?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  dateOfHire?: Maybe<Scalars['Date']['output']>;
  departments?: Maybe<Array<Maybe<IDepartment>>>;
  email: Scalars['String']['output'];
  emergencyContacts?: Maybe<IEmergencyContact>;
  employeId: Scalars['String']['output'];
  employmentType?: Maybe<IEmploymentType>;
  gender?: Maybe<IGender>;
  identification?: Maybe<IIdentification>;
  lastAttendance?: Maybe<ILastAttendance>;
  leaves?: Maybe<Array<Maybe<ILeave>>>;
  location?: Maybe<ILocation>;
  maritalStatus?: Maybe<IMaritalStatus>;
  mobileNumber?: Maybe<Scalars['String']['output']>;
  monthlyStats?: Maybe<Scalars['JSON']['output']>;
  name: Scalars['String']['output'];
  noticePeriodDate?: Maybe<Scalars['Date']['output']>;
  otp?: Maybe<Scalars['String']['output']>;
  password: Scalars['String']['output'];
  payrolls?: Maybe<Array<Maybe<IPayroll>>>;
  performanceReviews?: Maybe<Array<Maybe<IPerformanceReview>>>;
  permissions?: Maybe<Array<Maybe<IPermissions>>>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  portfolio?: Maybe<IPortfolio>;
  posTerminal?: Maybe<Scalars['ID']['output']>;
  position?: Maybe<Scalars['String']['output']>;
  probationEndDate?: Maybe<Scalars['Date']['output']>;
  salaryDetails?: Maybe<ISalaryDetails>;
  shift?: Maybe<Scalars['String']['output']>;
  stats?: Maybe<Scalars['JSON']['output']>;
  status?: Maybe<IEmployeeStatusType>;
  tokenKey?: Maybe<Scalars['String']['output']>;
  userName: Scalars['String']['output'];
  weeklyStats?: Maybe<Scalars['JSON']['output']>;
};

export enum IEmployeeAttendanceStatus {
  Absent = 'absent',
  OnLeave = 'onLeave',
  Present = 'present',
  ShiftEnded = 'shiftEnded'
}

export type IEmployeeInput = {
  allowLogin?: InputMaybe<Scalars['Boolean']['input']>;
  apps?: InputMaybe<Array<InputMaybe<IApps>>>;
  avatar?: InputMaybe<Scalars['String']['input']>;
  bankDetails?: InputMaybe<IBankAccountInput>;
  branch?: InputMaybe<Scalars['ID']['input']>;
  dateOfHire?: InputMaybe<Scalars['Date']['input']>;
  departments?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  email: Scalars['String']['input'];
  emergencyContacts?: InputMaybe<IEmergencyContactInput>;
  employeId: Scalars['String']['input'];
  employmentType?: InputMaybe<IEmploymentType>;
  gender?: InputMaybe<IGender>;
  identification?: InputMaybe<IIdentificationInput>;
  location?: InputMaybe<ILocationInput>;
  maritalStatus?: InputMaybe<IMaritalStatus>;
  mobileNumber?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  permissions?: InputMaybe<Array<InputMaybe<IPermissions>>>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  portfolio?: InputMaybe<IPortfolioInput>;
  position?: InputMaybe<Scalars['String']['input']>;
  probationEndDate?: InputMaybe<Scalars['Date']['input']>;
  salaryDetails?: InputMaybe<ISalaryDetailsInput>;
  shift?: InputMaybe<Scalars['String']['input']>;
  userName: Scalars['String']['input'];
};

export type IEmployeeStats = {
  overTime?: Maybe<Scalars['Float']['output']>;
  presentDays?: Maybe<Scalars['Int']['output']>;
  totalAbsent?: Maybe<Scalars['Int']['output']>;
  totalLeaves?: Maybe<Scalars['Int']['output']>;
  totalPaymentReceived?: Maybe<Scalars['Float']['output']>;
  workDays?: Maybe<Scalars['Int']['output']>;
};

export enum IEmployeeStatusType {
  Active = 'active',
  LaidOff = 'laidOff',
  OnNoticePeriod = 'onNoticePeriod',
  Terminated = 'terminated'
}

export type IEmployeesResponse = {
  employees: Array<IEmployee>;
  pageInfo: IPaginationInfo;
};

export enum IEmploymentType {
  FullTime = 'fullTime',
  Internship = 'internship',
  OnContract = 'onContract',
  PartTime = 'partTime',
  Trainee = 'trainee'
}

export type IEnterprise = {
  _id: Scalars['ObjectId']['output'];
  avatar?: Maybe<Scalars['String']['output']>;
  barcode?: Maybe<Scalars['String']['output']>;
  branches?: Maybe<Array<Maybe<Scalars['ObjectId']['output']>>>;
  businessHours?: Maybe<IBusinessHours>;
  city?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  dateFormat?: Maybe<Scalars['String']['output']>;
  department?: Maybe<IDepartment>;
  domain?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  employees?: Maybe<Array<Maybe<Scalars['ObjectId']['output']>>>;
  establishDate?: Maybe<Scalars['Date']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  location?: Maybe<ILocation>;
  name: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  positions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  purchaseStats?: Maybe<IPaymentPaidStats>;
  registrationNumber?: Maybe<Scalars['String']['output']>;
  saleStats?: Maybe<IPaymentReceivedStats>;
  subDomain?: Maybe<Scalars['String']['output']>;
  subscription?: Maybe<ISubscription>;
  subscriptionAuto?: Maybe<Scalars['Boolean']['output']>;
  taxID?: Maybe<Scalars['String']['output']>;
  timeZone?: Maybe<Scalars['String']['output']>;
  totalRevenue?: Maybe<Scalars['Float']['output']>;
  warehouses?: Maybe<Array<Maybe<Scalars['ObjectId']['output']>>>;
  website?: Maybe<Scalars['String']['output']>;
};

export type IEnterpriseConnection = {
  enterprises: Array<IEnterprise>;
  pageInfo: IPaginationInfo;
};

export type IEnterpriseJob = {
  _id?: Maybe<Scalars['String']['output']>;
  avatar?: Maybe<Scalars['String']['output']>;
  jobs?: Maybe<Array<Maybe<IRecruitmentJob>>>;
  name?: Maybe<Scalars['String']['output']>;
  subDomain?: Maybe<Scalars['String']['output']>;
};

export type IEnterpriseJobs = {
  enterprise?: Maybe<IEnterprise>;
};

export type IField = {
  key: Scalars['String']['input'];
  vale: Scalars['ObjectId']['input'];
};

export enum IGender {
  Female = 'female',
  Male = 'male',
  Other = 'other'
}

export type IGoogleAuthData = {
  isNewUser: Scalars['Boolean']['output'];
  token: Scalars['String']['output'];
};

export type IHoliday = {
  date: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type IHolidayInput = {
  date: Scalars['String']['input'];
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type IHrmConfig = {
  _id?: Maybe<Scalars['ObjectId']['output']>;
  companyPolicies?: Maybe<Array<ICompanyPolicy>>;
  holidays?: Maybe<Array<Maybe<IHoliday>>>;
  leavePolicies?: Maybe<Array<ILeavePolicy>>;
  payrollConfig?: Maybe<IPayrollConfig>;
  positions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  shifts?: Maybe<Array<Maybe<IShift>>>;
};

export type IIdentification = {
  dateOfBirth?: Maybe<Scalars['Date']['output']>;
  nationalIDBackImage?: Maybe<Scalars['String']['output']>;
  nationalIDFrontImage?: Maybe<Scalars['String']['output']>;
  passportImage?: Maybe<Scalars['String']['output']>;
  socialSecurityNumber?: Maybe<Scalars['String']['output']>;
};

export type IIdentificationInput = {
  dateOfBirth?: InputMaybe<Scalars['Date']['input']>;
  nationalIDBackImage?: InputMaybe<Scalars['String']['input']>;
  nationalIDFrontImage?: InputMaybe<Scalars['String']['input']>;
  passportImage?: InputMaybe<Scalars['String']['input']>;
  socialSecurityNumber?: InputMaybe<Scalars['String']['input']>;
};

export type IInsights = {
  locationDistribution: Scalars['JSON']['output'];
};

export type IInterviewer = {
  _id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type ILastAttendance = {
  date?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<IEmployeeAttendanceStatus>;
  time?: Maybe<Scalars['Date']['output']>;
};

export type ILead = {
  _id: Scalars['ObjectId']['output'];
  budget?: Maybe<Scalars['Float']['output']>;
  contact?: Maybe<IContact>;
  conversations?: Maybe<Array<Maybe<ILeadConversation>>>;
  createdAt: Scalars['String']['output'];
  createdBy: IUser;
  description?: Maybe<Scalars['String']['output']>;
  enterprise: Scalars['ID']['output'];
  expectedCloseDate?: Maybe<Scalars['Date']['output']>;
  industry?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  priority?: Maybe<IPriority>;
  status: ILeadStatus;
  updatedAt: Scalars['String']['output'];
};

export type ILeadConversation = {
  date: Scalars['Date']['output'];
  id: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  who?: Maybe<ILeadConversationWith>;
};

export type ILeadConversationInput = {
  id: Scalars['String']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
  who?: InputMaybe<ILeadConversationWith>;
};

export enum ILeadConversationWith {
  Contact = 'contact',
  Me = 'me'
}

export type ILeadInput = {
  budget?: InputMaybe<Scalars['Float']['input']>;
  contact: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  expectedCloseDate?: InputMaybe<Scalars['Date']['input']>;
  industry?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  priority?: InputMaybe<IPriority>;
  status?: InputMaybe<ILeadStatus>;
};

export enum ILeadStatus {
  Closed = 'closed',
  Draft = 'draft',
  InProgress = 'inProgress',
  Lost = 'lost'
}

export type ILeadStatusUpdateInput = {
  _id: Scalars['ID']['input'];
  status: ILeadStatus;
};

export type ILeave = {
  _id: Scalars['ObjectId']['output'];
  employee: IUser;
  endDate: Scalars['Date']['output'];
  reason: Scalars['String']['output'];
  startDate: Scalars['Date']['output'];
  status: ILeaveStatus;
  type: ILeaveType;
};

export type ILeaveInput = {
  endDate: Scalars['Date']['input'];
  reason: Scalars['String']['input'];
  startDate: Scalars['Date']['input'];
  type: ILeaveType;
};

export type ILeavePolicy = {
  days: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isPaid?: Maybe<Scalars['Boolean']['output']>;
  type: Scalars['String']['output'];
};

export type ILeavePolicyInput = {
  days: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  type: Scalars['String']['input'];
};

export enum ILeaveStatus {
  Approved = 'approved',
  Pending = 'pending',
  Rejected = 'rejected'
}

export enum ILeaveType {
  CasualLeave = 'casualLeave',
  Earnedleave = 'earnedleave',
  SickLeave = 'sickLeave'
}

export type ILocation = {
  address?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  zipCode?: Maybe<Scalars['String']['output']>;
};

export type ILocationInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  state: Scalars['String']['input'];
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export enum IMaritalStatus {
  Divorced = 'divorced',
  Married = 'married',
  Single = 'single',
  Widowed = 'widowed'
}

export enum IMeetingLocation {
  InPerson = 'in_person',
  Online = 'online'
}

export type IMetrics = {
  activeEnterprises: Scalars['Int']['output'];
  appsUsage: Scalars['JSON']['output'];
  averageRevenuePerEnterprise: Scalars['Float']['output'];
  cancelTransactions: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  monthlyRecurringRevenue: Scalars['Float']['output'];
  paymentConversion: Scalars['Float']['output'];
  paymentGatewayBreakdown: IPaymentGatewayBreakdown;
  pendingTransactions: Scalars['Int']['output'];
  planDistribution: Scalars['JSON']['output'];
  successfulTransactions: Scalars['Int']['output'];
  totalEnterprises: Scalars['Int']['output'];
  totalRevenue: Scalars['Float']['output'];
  totalRevenuePerYear: Scalars['JSON']['output'];
};

export enum IModel {
  Customer = 'customer',
  Employee = 'employee',
  Enterprise = 'enterprise',
  Supplier = 'supplier'
}

export type IMutation = {
  AddAppreciation?: Maybe<Scalars['String']['output']>;
  DeleteAppreciation?: Maybe<Scalars['String']['output']>;
  activeSubscriptionByAdmin: Scalars['String']['output'];
  addApp?: Maybe<Scalars['String']['output']>;
  addCountry: Scalars['String']['output'];
  addLeadConversation: Scalars['String']['output'];
  addMessageToSupportTicket: Scalars['String']['output'];
  applyLeave: Scalars['String']['output'];
  approvePayroll?: Maybe<Scalars['String']['output']>;
  assignDelivery: Scalars['String']['output'];
  assignSupportTicket: Scalars['String']['output'];
  cancelStripeSubscription?: Maybe<IPaymentCancelOrUpgradeResponse>;
  cancelSubscriptionByAdmin: Scalars['String']['output'];
  checkAbsentDays: Scalars['String']['output'];
  checkInOrOutWithUserName: ICheckInOrOutWithUserNameResponse;
  createAdmin?: Maybe<Scalars['String']['output']>;
  createAppointment: Scalars['String']['output'];
  createBranch: Scalars['String']['output'];
  createContact: Scalars['String']['output'];
  createCustomer: Scalars['String']['output'];
  createCustomerRFQ: Scalars['String']['output'];
  createDepartment: Scalars['String']['output'];
  createEmployee?: Maybe<IEmployee>;
  createEnterprise: Scalars['String']['output'];
  createJobCandidate: Scalars['String']['output'];
  createLead: Scalars['String']['output'];
  createPOSOrder: IPosOrder;
  createPOSRegister: Scalars['String']['output'];
  createPOSReturn: Scalars['String']['output'];
  createPOSTerminal: Scalars['String']['output'];
  createPOSTerminalBiller: Scalars['String']['output'];
  createPackage: Scalars['String']['output'];
  createPayroll: Scalars['String']['output'];
  createProduct: Scalars['String']['output'];
  createPurchaseOrder: Scalars['String']['output'];
  createPurchaseOrderPayment: Scalars['String']['output'];
  createPurchaseQuotation: Scalars['String']['output'];
  createPurchaseReceived: Scalars['String']['output'];
  createPurchaseReturn: Scalars['String']['output'];
  createRFQ: Scalars['String']['output'];
  createRecruitmentJob: Scalars['String']['output'];
  createSaleInvoice: Scalars['String']['output'];
  createSaleOrderPayment: Scalars['String']['output'];
  createSaleQuotation: Scalars['String']['output'];
  createSalesOrder: Scalars['String']['output'];
  createSalesReturn: Scalars['String']['output'];
  createService: Scalars['String']['output'];
  createServiceConfig: IServiceConfig;
  createStripeSubscription: IPaymentResponse;
  createSubscriptionByAdmin: Scalars['String']['output'];
  createSupplier: Scalars['String']['output'];
  createSupportTicket: Scalars['String']['output'];
  createTask: Scalars['String']['output'];
  deleteAdmin?: Maybe<Scalars['String']['output']>;
  deleteApp?: Maybe<Scalars['String']['output']>;
  deleteAppointment: Scalars['String']['output'];
  deleteBranch: Scalars['Boolean']['output'];
  deleteContact: Scalars['String']['output'];
  deleteCountry: Scalars['String']['output'];
  deleteCustomer: Scalars['ID']['output'];
  deleteCustomerRFQ: Scalars['Boolean']['output'];
  deleteDepartment?: Maybe<Scalars['Boolean']['output']>;
  deleteEmployee?: Maybe<Scalars['Boolean']['output']>;
  deleteEnterprise: Scalars['String']['output'];
  deleteJobCandidate: Scalars['String']['output'];
  deleteLead: Scalars['String']['output'];
  deleteLeadConversation: Scalars['String']['output'];
  deletePOSOrder: Scalars['String']['output'];
  deletePOSRegister: Scalars['String']['output'];
  deletePOSReturn: Scalars['Boolean']['output'];
  deletePOSTerminal: Scalars['String']['output'];
  deletePOSTerminalBiller: Scalars['String']['output'];
  deletePackage: Scalars['String']['output'];
  deletePayroll?: Maybe<Scalars['Boolean']['output']>;
  deleteProduct: Scalars['String']['output'];
  deletePurchaseOrder: Scalars['String']['output'];
  deletePurchaseOrderPayment: Scalars['Boolean']['output'];
  deletePurchaseQuotation: Scalars['String']['output'];
  deletePurchaseReceived: Scalars['Boolean']['output'];
  deletePurchaseReturn: Scalars['Boolean']['output'];
  deleteRFQ: Scalars['String']['output'];
  deleteRecruitmentJob: Scalars['String']['output'];
  deleteSaleOrderPayment: Scalars['Boolean']['output'];
  deleteSaleQuotation: Scalars['Boolean']['output'];
  deleteSalesOrder: Scalars['Boolean']['output'];
  deleteSalesReturn: Scalars['Boolean']['output'];
  deleteService: Scalars['String']['output'];
  deleteSupplier: Scalars['ID']['output'];
  deleteSupportTicket: Scalars['String']['output'];
  deleteSupportTicketMessage: Scalars['String']['output'];
  deleteTask: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  endShift: IAttendance;
  forgotAdminPassword?: Maybe<Scalars['String']['output']>;
  forgotPassword?: Maybe<Scalars['String']['output']>;
  googleLogin?: Maybe<IGoogleAuthData>;
  isValueExist: Array<Maybe<IIsValueExistResponse>>;
  login?: Maybe<IAuthData>;
  loginAdmin?: Maybe<IAuthData>;
  manageLeave: Scalars['String']['output'];
  mangeHrmConfig?: Maybe<IHrmConfig>;
  rejectRFQ: Scalars['String']['output'];
  removeLeave: Scalars['String']['output'];
  requestOverTime: Scalars['String']['output'];
  resetAdminPassword?: Maybe<Scalars['String']['output']>;
  resetPassword?: Maybe<Scalars['String']['output']>;
  sendOTP?: Maybe<IAuthResendOtpResponse>;
  startShift: IAttendance;
  terminateEmployee: Scalars['String']['output'];
  updateAdmin?: Maybe<Scalars['String']['output']>;
  updateApp?: Maybe<Scalars['String']['output']>;
  updateAppointment?: Maybe<Scalars['String']['output']>;
  updateAppointmentStatus: Scalars['String']['output'];
  updateBranch: Scalars['String']['output'];
  updateContact: Scalars['String']['output'];
  updateCountry: Scalars['String']['output'];
  updateCustomer: Scalars['String']['output'];
  updateCustomerRFQActive: Scalars['String']['output'];
  updateCustomerRFQStatus: Scalars['String']['output'];
  updateDepartment: Scalars['String']['output'];
  updateEmployee?: Maybe<IEmployee>;
  updateEnterprise: Scalars['String']['output'];
  updateJobCandidateStatus: Scalars['String']['output'];
  updateLead: Scalars['String']['output'];
  updateLeadStatuses: Scalars['String']['output'];
  updateLeave: Scalars['String']['output'];
  updateOverTimeRequestStatus: Scalars['String']['output'];
  updatePOSOrder: IPosOrder;
  updatePOSRegister: Scalars['String']['output'];
  updatePOSRegisterStatus: Scalars['String']['output'];
  updatePOSTerminal: Scalars['String']['output'];
  updatePackage: Scalars['String']['output'];
  updatePayroll: Scalars['String']['output'];
  updateProduct: Scalars['String']['output'];
  updateProductConfig: Scalars['String']['output'];
  updatePurchaseInvoiceStatus: Scalars['String']['output'];
  updatePurchaseOrderStatus: Scalars['String']['output'];
  updatePurchaseQuotation: Scalars['String']['output'];
  updatePurchaseQuotationStatus: Scalars['String']['output'];
  updatePurchaseReturnStatus: Scalars['String']['output'];
  updateRFQStatus: Scalars['String']['output'];
  updateRecruitmentJobStatus: Scalars['String']['output'];
  updateSaleInvoiceStatus: Scalars['String']['output'];
  updateSaleQuotationStatus: Scalars['String']['output'];
  updateSalesOrderStatus: Scalars['String']['output'];
  updateSalesReturnStatus: Scalars['String']['output'];
  updateService: Scalars['String']['output'];
  updateServiceConfig: IServiceConfig;
  updateSubscriptionByAdmin: Scalars['String']['output'];
  updateSupplier: Scalars['String']['output'];
  updateSupportTicketStatuses: Scalars['String']['output'];
  updateSystem?: Maybe<Scalars['String']['output']>;
  updateTask: Scalars['String']['output'];
  updateTaskStatuses: Scalars['String']['output'];
  upgradeStripeSubscription: IPaymentCancelOrUpgradeResponse;
  uploadFile: Scalars['String']['output'];
  uploadImage?: Maybe<Scalars['String']['output']>;
  uploadPhoto?: Maybe<Scalars['String']['output']>;
  verifyEmployeeFields: Scalars['Boolean']['output'];
  verifyOTP?: Maybe<IAuthVerifyOtpResponse>;
};


export type IMutationAddAppreciationArgs = {
  input?: InputMaybe<IAppreciationInput>;
};


export type IMutationDeleteAppreciationArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type IMutationActiveSubscriptionByAdminArgs = {
  enterpriseId: Scalars['ID']['input'];
  token: Scalars['String']['input'];
};


export type IMutationAddAppArgs = {
  input?: InputMaybe<IAppInput>;
};


export type IMutationAddCountryArgs = {
  input: ICountryInput;
};


export type IMutationAddLeadConversationArgs = {
  id: Scalars['ID']['input'];
  input: ILeadConversationInput;
};


export type IMutationAddMessageToSupportTicketArgs = {
  message: ISupportTicketMessageInput;
  ticketId: Scalars['ID']['input'];
};


export type IMutationApplyLeaveArgs = {
  input: ILeaveInput;
};


export type IMutationApprovePayrollArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationAssignDeliveryArgs = {
  employeeId: Scalars['ID']['input'];
  orderId: Scalars['ID']['input'];
};


export type IMutationAssignSupportTicketArgs = {
  assignedTo: Scalars['ID']['input'];
  ticketId: Scalars['ID']['input'];
};


export type IMutationCancelSubscriptionByAdminArgs = {
  enterpriseId: Scalars['ID']['input'];
  token: Scalars['String']['input'];
};


export type IMutationCheckInOrOutWithUserNameArgs = {
  userName: Scalars['String']['input'];
};


export type IMutationCreateAdminArgs = {
  input?: InputMaybe<ICreateAdminInput>;
};


export type IMutationCreateAppointmentArgs = {
  input: IAppointmentInput;
};


export type IMutationCreateBranchArgs = {
  input: ICreateBranchInput;
};


export type IMutationCreateContactArgs = {
  input: IContactInput;
};


export type IMutationCreateCustomerArgs = {
  input: ICustomerInput;
};


export type IMutationCreateCustomerRfqArgs = {
  input: ICreateCustomerRfqInput;
};


export type IMutationCreateDepartmentArgs = {
  input: IDepartmentInput;
};


export type IMutationCreateEmployeeArgs = {
  input: IEmployeeInput;
};


export type IMutationCreateEnterpriseArgs = {
  country: Scalars['String']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  logo?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  subDomain: Scalars['String']['input'];
};


export type IMutationCreateJobCandidateArgs = {
  input: IRecruitmentCandidateInput;
};


export type IMutationCreateLeadArgs = {
  input: ILeadInput;
};


export type IMutationCreatePosOrderArgs = {
  input: ICreatePosOrderInput;
};


export type IMutationCreatePosRegisterArgs = {
  input: ICreatePosRegisterInput;
};


export type IMutationCreatePosReturnArgs = {
  input: ICreatePosReturnInput;
};


export type IMutationCreatePosTerminalArgs = {
  input: ICreatePosTerminalInput;
};


export type IMutationCreatePosTerminalBillerArgs = {
  employee: Scalars['ID']['input'];
  terminal: Scalars['ID']['input'];
};


export type IMutationCreatePackageArgs = {
  input: IPackageInput;
};


export type IMutationCreatePayrollArgs = {
  input: IPayrollInput;
};


export type IMutationCreateProductArgs = {
  input: IProductInput;
};


export type IMutationCreatePurchaseOrderArgs = {
  input: IPurchaseOrderInput;
};


export type IMutationCreatePurchaseOrderPaymentArgs = {
  input: ICreatePurchaseOrderPaymentInput;
};


export type IMutationCreatePurchaseQuotationArgs = {
  input: IQuotationInput;
};


export type IMutationCreatePurchaseReceivedArgs = {
  input: ICreatePurchaseReceivedInput;
};


export type IMutationCreatePurchaseReturnArgs = {
  input: ICreatePurchaseReturnInput;
};


export type IMutationCreateRfqArgs = {
  input: ICreateRfqInput;
};


export type IMutationCreateRecruitmentJobArgs = {
  input: IRecruitmentJobInput;
};


export type IMutationCreateSaleInvoiceArgs = {
  orderId: Scalars['ID']['input'];
  receivedDate: Scalars['Date']['input'];
};


export type IMutationCreateSaleOrderPaymentArgs = {
  input: ICreateSaleOrderPaymentInput;
};


export type IMutationCreateSaleQuotationArgs = {
  input: ICreateSaleQuotationInput;
};


export type IMutationCreateSalesOrderArgs = {
  input: ICreateSalesOrderInput;
};


export type IMutationCreateSalesReturnArgs = {
  input: ICreateSalesReturnInput;
};


export type IMutationCreateServiceArgs = {
  input: IServiceInput;
};


export type IMutationCreateServiceConfigArgs = {
  input: IServiceConfigInput;
};


export type IMutationCreateStripeSubscriptionArgs = {
  input: ICreateSubScriptionInput;
};


export type IMutationCreateSubscriptionByAdminArgs = {
  enterpriseId: Scalars['ID']['input'];
  input: ICreateSubscriptionByAdminInput;
  token: Scalars['String']['input'];
};


export type IMutationCreateSupplierArgs = {
  input: ISupplierInput;
};


export type IMutationCreateSupportTicketArgs = {
  input: ISupportTicketInput;
};


export type IMutationCreateTaskArgs = {
  input: ITaskInput;
};


export type IMutationDeleteAdminArgs = {
  adminId: Scalars['ID']['input'];
};


export type IMutationDeleteAppArgs = {
  id: Scalars['ObjectId']['input'];
};


export type IMutationDeleteAppointmentArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteBranchArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteContactArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteCountryArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteCustomerRfqArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteDepartmentArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteEmployeeArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteEnterpriseArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteJobCandidateArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteLeadArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteLeadConversationArgs = {
  conversationId: Scalars['ID']['input'];
  leadId: Scalars['ID']['input'];
};


export type IMutationDeletePosOrderArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeletePosRegisterArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeletePosReturnArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeletePosTerminalArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeletePosTerminalBillerArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeletePackageArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeletePayrollArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteProductArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeletePurchaseOrderArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeletePurchaseOrderPaymentArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeletePurchaseQuotationArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeletePurchaseReceivedArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeletePurchaseReturnArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteRfqArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteRecruitmentJobArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteSaleOrderPaymentArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteSaleQuotationArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteSalesOrderArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteSalesReturnArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteServiceArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteSupplierArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationDeleteSupportTicketArgs = {
  ticketId: Scalars['ID']['input'];
};


export type IMutationDeleteSupportTicketMessageArgs = {
  message: Scalars['ID']['input'];
  ticketId: Scalars['ID']['input'];
};


export type IMutationDeleteTaskArgs = {
  id: Scalars['ID']['input'];
};


export type IMutationForgotAdminPasswordArgs = {
  email: Scalars['String']['input'];
};


export type IMutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
  userType: IUserType;
};


export type IMutationGoogleLoginArgs = {
  token: Scalars['String']['input'];
  userType: IUserType;
};


export type IMutationIsValueExistArgs = {
  fields: Array<IField>;
  model?: InputMaybe<IModel>;
};


export type IMutationLoginArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  userName?: InputMaybe<Scalars['String']['input']>;
  userType: IUserType;
};


export type IMutationLoginAdminArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type IMutationManageLeaveArgs = {
  leaveId: Scalars['ID']['input'];
  status: ILeaveStatus;
};


export type IMutationMangeHrmConfigArgs = {
  companyPolicies?: InputMaybe<Array<InputMaybe<ICompanyPolicyInput>>>;
  holidays?: InputMaybe<Array<InputMaybe<IHolidayInput>>>;
  leavePolicies?: InputMaybe<Array<InputMaybe<ILeavePolicyInput>>>;
  payrollConfig?: InputMaybe<IPayrollConfigInput>;
  positions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  shifts?: InputMaybe<Array<InputMaybe<IShiftInput>>>;
};


export type IMutationRejectRfqArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type IMutationRemoveLeaveArgs = {
  leaveId: Scalars['ID']['input'];
};


export type IMutationResetAdminPasswordArgs = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type IMutationResetPasswordArgs = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
  userType: IUserType;
};


export type IMutationSendOtpArgs = {
  email: Scalars['String']['input'];
  userType: IUserType;
};


export type IMutationTerminateEmployeeArgs = {
  allowLogin: Scalars['Boolean']['input'];
  apps: Array<InputMaybe<Scalars['String']['input']>>;
  departments: Array<InputMaybe<Scalars['String']['input']>>;
  id: Scalars['ID']['input'];
  noticePeriodDate?: InputMaybe<Scalars['String']['input']>;
  permissions: Array<InputMaybe<Scalars['String']['input']>>;
  status: IEmployeeStatusType;
};


export type IMutationUpdateAdminArgs = {
  adminId: Scalars['ID']['input'];
  input?: InputMaybe<ICreateAdminInput>;
};


export type IMutationUpdateAppArgs = {
  id: Scalars['ObjectId']['input'];
  input?: InputMaybe<IAppInput>;
};


export type IMutationUpdateAppointmentArgs = {
  id: Scalars['ID']['input'];
  input: IAppointmentInput;
};


export type IMutationUpdateAppointmentStatusArgs = {
  id: Scalars['ID']['input'];
  status: IAppointmentStatus;
};


export type IMutationUpdateBranchArgs = {
  id: Scalars['ID']['input'];
  input: ICreateBranchInput;
};


export type IMutationUpdateContactArgs = {
  id: Scalars['ID']['input'];
  input: IContactInput;
};


export type IMutationUpdateCountryArgs = {
  id: Scalars['ID']['input'];
  input: ICountryInput;
};


export type IMutationUpdateCustomerArgs = {
  id: Scalars['ID']['input'];
  input: ICustomerInput;
};


export type IMutationUpdateCustomerRfqActiveArgs = {
  id: Scalars['ID']['input'];
  isActive: Scalars['Boolean']['input'];
};


export type IMutationUpdateCustomerRfqStatusArgs = {
  id: Scalars['ID']['input'];
  status: ICustomerRfqStatus;
};


export type IMutationUpdateDepartmentArgs = {
  id: Scalars['ID']['input'];
  input: IDepartmentInput;
};


export type IMutationUpdateEmployeeArgs = {
  id: Scalars['ID']['input'];
  input: IEmployeeInput;
};


export type IMutationUpdateEnterpriseArgs = {
  id: Scalars['ID']['input'];
  input: IUpdateEnterpriseInput;
};


export type IMutationUpdateJobCandidateStatusArgs = {
  id: Scalars['ID']['input'];
  interviewAt?: InputMaybe<Scalars['Date']['input']>;
  interviewLocation?: InputMaybe<Scalars['String']['input']>;
  interviewMeetLink?: InputMaybe<Scalars['String']['input']>;
  interviewer?: InputMaybe<Scalars['String']['input']>;
  interviewerEmail?: InputMaybe<Scalars['String']['input']>;
  status: IRecruitmentCandidateStatus;
};


export type IMutationUpdateLeadArgs = {
  id: Scalars['ID']['input'];
  input: ILeadInput;
};


export type IMutationUpdateLeadStatusesArgs = {
  input: Array<ILeadStatusUpdateInput>;
};


export type IMutationUpdateLeaveArgs = {
  input: ILeaveInput;
  leaveId: Scalars['ID']['input'];
};


export type IMutationUpdateOverTimeRequestStatusArgs = {
  attendanceId: Scalars['ID']['input'];
  status: IOverTimeStatusEnum;
};


export type IMutationUpdatePosOrderArgs = {
  id: Scalars['ID']['input'];
  input: ICreatePosOrderInput;
};


export type IMutationUpdatePosRegisterArgs = {
  id: Scalars['ID']['input'];
  input: ICreatePosRegisterInput;
};


export type IMutationUpdatePosRegisterStatusArgs = {
  id: Scalars['ID']['input'];
  status: IPosRegisterStatus;
};


export type IMutationUpdatePosTerminalArgs = {
  id: Scalars['ID']['input'];
  input: ICreatePosTerminalInput;
};


export type IMutationUpdatePackageArgs = {
  id: Scalars['ID']['input'];
  input: IPackageInput;
};


export type IMutationUpdatePayrollArgs = {
  id: Scalars['ID']['input'];
  input: IPayrollInput;
};


export type IMutationUpdateProductArgs = {
  id: Scalars['ID']['input'];
  input: IProductInput;
};


export type IMutationUpdateProductConfigArgs = {
  input: IProductConfigInput;
};


export type IMutationUpdatePurchaseInvoiceStatusArgs = {
  orderId: Scalars['ID']['input'];
  status: IOrderInvoiceStatus;
};


export type IMutationUpdatePurchaseOrderStatusArgs = {
  id: Scalars['ID']['input'];
  status: IPurchaseOrderStatus;
};


export type IMutationUpdatePurchaseQuotationArgs = {
  id: Scalars['ID']['input'];
  input: IQuotationInput;
};


export type IMutationUpdatePurchaseQuotationStatusArgs = {
  id: Scalars['ID']['input'];
  status: IQuotationStatus;
};


export type IMutationUpdatePurchaseReturnStatusArgs = {
  id: Scalars['ID']['input'];
  status: IPurchaseReturnStatus;
};


export type IMutationUpdateRfqStatusArgs = {
  id: Scalars['ID']['input'];
  status: IRfqStatus;
};


export type IMutationUpdateRecruitmentJobStatusArgs = {
  id: Scalars['ID']['input'];
  status: IRecruitmentJobStatus;
};


export type IMutationUpdateSaleInvoiceStatusArgs = {
  orderId: Scalars['ID']['input'];
  status: IOrderInvoiceStatus;
};


export type IMutationUpdateSaleQuotationStatusArgs = {
  id: Scalars['ID']['input'];
  status: IQuotationStatus;
};


export type IMutationUpdateSalesOrderStatusArgs = {
  id: Scalars['ID']['input'];
  status: ISalesOrderStatus;
};


export type IMutationUpdateSalesReturnStatusArgs = {
  id: Scalars['ID']['input'];
  status: ISalesReturnStatus;
};


export type IMutationUpdateServiceArgs = {
  id: Scalars['ID']['input'];
  input: IServiceInput;
};


export type IMutationUpdateServiceConfigArgs = {
  input: IServiceConfigInput;
};


export type IMutationUpdateSubscriptionByAdminArgs = {
  enterpriseId: Scalars['ID']['input'];
  input: ICreateSubscriptionByAdminInput;
  token: Scalars['String']['input'];
};


export type IMutationUpdateSupplierArgs = {
  id: Scalars['ID']['input'];
  input: ISupplierInput;
};


export type IMutationUpdateSupportTicketStatusesArgs = {
  input: Array<ISupportTicketStatusUpdateInput>;
};


export type IMutationUpdateSystemArgs = {
  input?: InputMaybe<ISystemInput>;
};


export type IMutationUpdateTaskArgs = {
  id: Scalars['ID']['input'];
  input: ITaskInput;
};


export type IMutationUpdateTaskStatusesArgs = {
  input: Array<ITaskStatusUpdateInput>;
};


export type IMutationUpgradeStripeSubscriptionArgs = {
  input: ICreateSubScriptionInput;
};


export type IMutationUploadFileArgs = {
  file: Scalars['Upload']['input'];
};


export type IMutationUploadImageArgs = {
  file: Scalars['Upload']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type IMutationUploadPhotoArgs = {
  file: Scalars['Upload']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type IMutationVerifyEmployeeFieldsArgs = {
  input?: InputMaybe<IVerifyEmployeeFieldsInput>;
};


export type IMutationVerifyOtpArgs = {
  email: Scalars['String']['input'];
  otp: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  userType: IUserType;
};

export enum IOrderInvoiceStatus {
  Draft = 'draft',
  Overdue = 'overdue',
  Paid = 'paid',
  Partial = 'partial',
  Sent = 'sent'
}

export enum IOverTimeStatusEnum {
  Approved = 'approved',
  Pending = 'pending',
  Rejected = 'rejected'
}

export type IPosOrder = {
  _id: Scalars['ID']['output'];
  branch?: Maybe<IBranch>;
  cardAmount?: Maybe<Scalars['Float']['output']>;
  cashAmount?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['Date']['output'];
  customer?: Maybe<IUser>;
  hasReturnedProduct?: Maybe<Scalars['Boolean']['output']>;
  onlineAmount?: Maybe<Scalars['Float']['output']>;
  orderNumber: Scalars['String']['output'];
  posRegister: Scalars['ID']['output'];
  posTerminal?: Maybe<IPosTerminal>;
  products?: Maybe<Array<IPosOrderProduct>>;
  totalAmount: Scalars['Float']['output'];
  totalDiscount: Scalars['Float']['output'];
  totalReturnAmount?: Maybe<Scalars['Float']['output']>;
  totalTax: Scalars['Float']['output'];
};

export type IPosOrderProduct = {
  discount?: Maybe<Scalars['Float']['output']>;
  price: Scalars['Float']['output'];
  product?: Maybe<IProduct>;
  quantity: Scalars['Int']['output'];
  returnAmount?: Maybe<Scalars['Float']['output']>;
  returnQuantity?: Maybe<Scalars['Float']['output']>;
  taxes?: Maybe<Array<Maybe<ITaxType>>>;
  total: Scalars['Float']['output'];
};

export type IPosOrderProductInput = {
  discount?: InputMaybe<Scalars['Float']['input']>;
  price: Scalars['Float']['input'];
  product: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  taxes: Array<InputMaybe<ITaxInput>>;
  total: Scalars['Float']['input'];
};

export type IPosRegister = {
  _id?: Maybe<Scalars['ID']['output']>;
  branch?: Maybe<IBranch>;
  cardSales?: Maybe<Scalars['Float']['output']>;
  cashSales?: Maybe<Scalars['Float']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  creditSales?: Maybe<Scalars['Float']['output']>;
  date?: Maybe<Scalars['Int']['output']>;
  month?: Maybe<Scalars['Int']['output']>;
  onlineSales?: Maybe<Scalars['Float']['output']>;
  orders?: Maybe<Array<Scalars['ID']['output']>>;
  posTerminal?: Maybe<IPosTerminal>;
  registerNumber?: Maybe<Scalars['String']['output']>;
  status?: Maybe<IPosRegisterStatus>;
  totalExpense?: Maybe<Scalars['Float']['output']>;
  totalPayment?: Maybe<Scalars['Float']['output']>;
  totalRefund?: Maybe<Scalars['Float']['output']>;
  totalSales?: Maybe<Scalars['Float']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

export enum IPosRegisterStatus {
  Closed = 'closed',
  Open = 'open'
}

export type IPosReturn = {
  _id: Scalars['ID']['output'];
  branch: IBranch;
  createdAt: Scalars['Date']['output'];
  customer?: Maybe<IUser>;
  notes?: Maybe<Scalars['String']['output']>;
  originalOrderNumber?: Maybe<Scalars['String']['output']>;
  posRegister?: Maybe<IPosRegister>;
  posTerminal?: Maybe<IPosTerminal>;
  processedBy?: Maybe<IUser>;
  products?: Maybe<Array<IPosReturnProduct>>;
  returnNumber: Scalars['String']['output'];
  totalReturnAmount?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['Date']['output'];
};

export type IPosReturnFilterInput = {
  endDate?: InputMaybe<Scalars['Date']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
};

export type IPosReturnProduct = {
  price: Scalars['Float']['output'];
  product: IProduct;
  quantity: Scalars['Int']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  total: Scalars['Float']['output'];
};

export type IPosReturnProductInput = {
  price: Scalars['Float']['input'];
  product: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  total: Scalars['Float']['input'];
};

export type IPosReturnResponse = {
  pageInfo: IPaginationInfo;
  returns: Array<IPosReturn>;
};

export type IPosTerminal = {
  _id?: Maybe<Scalars['ID']['output']>;
  branch?: Maybe<IBranch>;
  name?: Maybe<Scalars['String']['output']>;
  operator?: Maybe<IUser>;
};

export type IPosTerminalBiller = {
  _id: Scalars['ID']['output'];
  avatar?: Maybe<Scalars['String']['output']>;
  branch?: Maybe<IBranch>;
  email: Scalars['String']['output'];
  employeId: Scalars['String']['output'];
  mobileNumber?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  posTerminal?: Maybe<IPosTerminal>;
};

export type IPackage = {
  _id: Scalars['ObjectId']['output'];
  apps: Array<Maybe<IApp>>;
  branchesLimits: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  features: Array<Maybe<Scalars['String']['output']>>;
  monthlyPrice: Scalars['Float']['output'];
  stripeMonthlyPriceId: Scalars['String']['output'];
  stripeYearlyPriceId: Scalars['String']['output'];
  title: Scalars['String']['output'];
  usersLimits: Scalars['Int']['output'];
  yearlyPrice: Scalars['Float']['output'];
};

export type IPackageInput = {
  apps: Array<Scalars['String']['input']>;
  branchesLimits: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  features: Array<Scalars['String']['input']>;
  stripeMonthlyPriceId: Scalars['String']['input'];
  stripeYearlyPriceId: Scalars['String']['input'];
  title: Scalars['String']['input'];
  usersLimits: Scalars['Int']['input'];
};

export type IPaginationInfo = {
  currentPage: Scalars['Int']['output'];
  totalItems: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type IPaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type IPaymentCancelOrUpgradeResponse = {
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type IPaymentGatewayBreakdown = {
  offline: Scalars['Int']['output'];
  stripe: Scalars['Int']['output'];
  tap: Scalars['Int']['output'];
};

export enum IPaymentMethod {
  Card = 'card',
  Cash = 'cash',
  Check = 'check',
  Offline = 'offline',
  Online = 'online',
  Stripe = 'stripe',
  Tap = 'tap'
}

export type IPaymentPaidStats = {
  amountPaid?: Maybe<Scalars['Float']['output']>;
  amountRemaining?: Maybe<Scalars['Float']['output']>;
  amountReturn?: Maybe<Scalars['Float']['output']>;
  totalAmount?: Maybe<Scalars['Float']['output']>;
};

export type IPaymentReceivedStats = {
  amountReceived?: Maybe<Scalars['Float']['output']>;
  amountRemaining?: Maybe<Scalars['Float']['output']>;
  amountReturn?: Maybe<Scalars['Float']['output']>;
  totalAmount?: Maybe<Scalars['Float']['output']>;
};

export type IPaymentResponse = {
  url?: Maybe<Scalars['String']['output']>;
};

export enum IPaymentStatus {
  Paid = 'paid',
  Partial = 'partial'
}

export enum IPaymentTerms {
  Net_15 = 'NET_15',
  Net_30 = 'NET_30',
  Net_45 = 'NET_45',
  Net_60 = 'NET_60'
}

export type IPayroll = {
  _id: Scalars['ObjectId']['output'];
  allowances?: Maybe<Array<Maybe<ICustomField>>>;
  basicPay: Scalars['Float']['output'];
  currency?: Maybe<Scalars['String']['output']>;
  deductions?: Maybe<Array<Maybe<ICustomField>>>;
  employee: IUser;
  enterprise?: Maybe<IEnterprise>;
  grossPay: Scalars['Float']['output'];
  netPay: Scalars['Float']['output'];
  payDate: Scalars['Date']['output'];
  status?: Maybe<IPayrollStatus>;
};

export type IPayrollConfig = {
  overtimeRate: Scalars['Float']['output'];
  salaryCycle: ISalaryCycle;
  taxDeduction: Scalars['Boolean']['output'];
};

export type IPayrollConfigInput = {
  overtimeRate?: InputMaybe<Scalars['Float']['input']>;
  salaryCycle: ISalaryCycle;
  taxDeduction?: InputMaybe<Scalars['Boolean']['input']>;
};

export type IPayrollInput = {
  absence: Scalars['Int']['input'];
  allowances?: InputMaybe<Array<InputMaybe<ICustomFieldInput>>>;
  basicPay: Scalars['Int']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
  deductions?: InputMaybe<Array<InputMaybe<ICustomFieldInput>>>;
  employeeId: Scalars['ID']['input'];
  grossPay: Scalars['Float']['input'];
  netPay: Scalars['Float']['input'];
  payDate: Scalars['Date']['input'];
  totalWorkDays: Scalars['Int']['input'];
};

export enum IPayrollStatus {
  Paid = 'paid',
  Pending = 'pending'
}

export type IPerformanceReview = {
  comments: Scalars['String']['output'];
  date: Scalars['Date']['output'];
  employee: IUser;
  id: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
  reviewer: IUser;
};

export type IPerformanceReviewInput = {
  comments: Scalars['String']['input'];
  date: Scalars['Date']['input'];
  employeeId: Scalars['ID']['input'];
  rating: Scalars['Int']['input'];
  reviewerId: Scalars['ID']['input'];
};

export enum IPermissions {
  ApprovePayroll = 'approve_payroll',
  ManageAppreciation = 'manage_appreciation',
  ManageAttendace = 'manage_attendace',
  ManageBranch = 'manage_branch',
  ManageContacts = 'manage_contacts',
  ManageCustomerSupport = 'manage_customer_support',
  ManageCustomers = 'manage_customers',
  ManageDelivery = 'manage_delivery',
  ManageDepartment = 'manage_department',
  ManageEmployee = 'manage_employee',
  ManageHrmConfig = 'manage_hrm_config',
  ManageJobs = 'manage_jobs',
  ManageJobsCandidates = 'manage_jobs_candidates',
  ManageLeads = 'manage_leads',
  ManageLeaves = 'manage_leaves',
  ManageOvertimeRequests = 'manage_overtime_requests',
  ManagePayroll = 'manage_payroll',
  ManagePositions = 'manage_positions',
  TerminateEmployee = 'terminate_employee',
  ViewAppreciation = 'view_appreciation',
  ViewAttendace = 'view_attendace',
  ViewDepartment = 'view_department',
  ViewEmployees = 'view_employees',
  ViewHrmConfig = 'view_hrm_config',
  ViewJobs = 'view_jobs',
  ViewJobsCanndidates = 'view_jobs_canndidates',
  ViewLeaves = 'view_leaves',
  ViewOvertimeRequests = 'view_overtime_requests',
  ViewPayroll = 'view_payroll',
  ViewPositions = 'view_positions'
}

export type IPortfolio = {
  bio?: Maybe<Scalars['String']['output']>;
  cv?: Maybe<Scalars['String']['output']>;
  skills?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  totalYearsOfEperience?: Maybe<Scalars['Int']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type IPortfolioInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  cv?: InputMaybe<Scalars['String']['input']>;
  skills?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  totalYearsOfEperience?: InputMaybe<Scalars['Int']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export enum IPriority {
  High = 'high',
  Low = 'low',
  Medium = 'medium'
}

export type IProduct = {
  _id: Scalars['ID']['output'];
  barcode?: Maybe<Scalars['String']['output']>;
  categories: Array<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  currentQuantity?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  images: Array<Scalars['String']['output']>;
  initialQuantity?: Maybe<Scalars['Int']['output']>;
  isPublished: Scalars['Boolean']['output'];
  purchasePrice: Scalars['Float']['output'];
  purchaseQuantity?: Maybe<Scalars['Int']['output']>;
  salePrice?: Maybe<Scalars['Float']['output']>;
  saleQuantity?: Maybe<Scalars['Int']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
  sizes?: Maybe<Array<Maybe<IProductSize>>>;
  sku?: Maybe<Scalars['String']['output']>;
  taxes?: Maybe<Array<Maybe<ITaxType>>>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  unit?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  variants?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  weight?: Maybe<Scalars['Float']['output']>;
};

export type IProductConfig = {
  _id: Scalars['ID']['output'];
  barcode?: Maybe<Scalars['String']['output']>;
  categories: Array<IProductConfigCategory>;
  sizes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  taxes?: Maybe<Array<Maybe<ITaxType>>>;
  units?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type IProductConfigCategory = {
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  subCategories?: Maybe<Array<Maybe<IProductConfigSubCategory>>>;
};

export type IProductConfigCategoryInput = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  subCategories?: InputMaybe<Array<InputMaybe<IProductConfigSubCategoryInput>>>;
};

export type IProductConfigInput = {
  barcode?: InputMaybe<Scalars['String']['input']>;
  categories: Array<IProductConfigCategoryInput>;
  sizes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  taxes: Array<InputMaybe<ITaxInput>>;
  units: Array<Scalars['String']['input']>;
};

export type IProductConfigSubCategory = {
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  subCategories?: Maybe<Array<Maybe<IProductConfigSubCategory>>>;
};

export type IProductConfigSubCategoryInput = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  subCategories?: InputMaybe<Array<InputMaybe<IProductConfigSubCategoryInput>>>;
};

export type IProductFilterInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
};

export type IProductInput = {
  barcode?: InputMaybe<Scalars['String']['input']>;
  categories: Array<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  currentQuantity?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isPublished: Scalars['Boolean']['input'];
  purchasePrice: Scalars['Float']['input'];
  salePrice?: InputMaybe<Scalars['Float']['input']>;
  shortDescription?: InputMaybe<Scalars['String']['input']>;
  sizes?: InputMaybe<Array<InputMaybe<IProductSizeInput>>>;
  sku?: InputMaybe<Scalars['String']['input']>;
  taxes: Array<InputMaybe<ITaxInput>>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  unit?: InputMaybe<Scalars['String']['input']>;
  variants?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type IProductSize = {
  quantity: Scalars['Int']['output'];
  size: Scalars['String']['output'];
};

export type IProductSizeInput = {
  quantity: Scalars['Int']['input'];
  size: Scalars['String']['input'];
};

export type IProductTotals = {
  discountRate: Scalars['Float']['output'];
  totalAmount?: Maybe<Scalars['Float']['output']>;
  totalDiscount: Scalars['Float']['output'];
  totalSubAmount: Scalars['Float']['output'];
  totalTax: Scalars['Float']['output'];
  totalTaxRate: Scalars['Float']['output'];
};

export type IProductTotalsInput = {
  discountRate: Scalars['Float']['input'];
  totalAmount?: InputMaybe<Scalars['Float']['input']>;
  totalDiscount: Scalars['Float']['input'];
  totalSubAmount: Scalars['Float']['input'];
  totalTax: Scalars['Float']['input'];
  totalTaxRate: Scalars['Float']['input'];
};

export type IProject = {
  client?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['Date']['output']>;
  isCompleted?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  role: Scalars['String']['output'];
  startDate: Scalars['Date']['output'];
  technologiesUsed?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type IPurchaseOrder = {
  _id: Scalars['ID']['output'];
  allReceived?: Maybe<Scalars['Boolean']['output']>;
  amountPaid?: Maybe<Scalars['Float']['output']>;
  amountRemaining?: Maybe<Scalars['Float']['output']>;
  attachment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['ID']['output']>;
  createdByType: Scalars['String']['output'];
  deliveryDate: Scalars['Date']['output'];
  invoiceStatus: IOrderInvoiceStatus;
  orderDate: Scalars['Date']['output'];
  paymentTerms: IPaymentTerms;
  products: Array<IPurchaseOrderProduct>;
  quotation?: Maybe<Scalars['ID']['output']>;
  quotationNumber?: Maybe<Scalars['String']['output']>;
  referenceNumber: Scalars['String']['output'];
  shippingAddress: Scalars['String']['output'];
  status: IPurchaseOrderStatus;
  supplier: ISupplier;
  totals: IProductTotals;
  updatedAt: Scalars['Date']['output'];
};

export type IPurchaseOrderInput = {
  attachment?: InputMaybe<Scalars['String']['input']>;
  deliveryDate: Scalars['Date']['input'];
  orderDate: Scalars['Date']['input'];
  paymentTerms?: InputMaybe<IPaymentTerms>;
  products: Array<IPurchaseOrderProductInput>;
  quotation?: InputMaybe<Scalars['ID']['input']>;
  shippingAddress: Scalars['String']['input'];
  supplier: Scalars['ID']['input'];
  totals: IProductTotalsInput;
};

export type IPurchaseOrderPayment = {
  _id: Scalars['ID']['output'];
  amountPaid: Scalars['Float']['output'];
  createdAt: Scalars['Date']['output'];
  paymentDate?: Maybe<Scalars['Date']['output']>;
  paymentMethod: IPaymentMethod;
  paymentNote?: Maybe<Scalars['String']['output']>;
  paymentNumber: Scalars['String']['output'];
  paymentStatus: IPaymentStatus;
  purchaseOrderNumber?: Maybe<Scalars['String']['output']>;
  supplier: IUser;
  updatedAt: Scalars['Date']['output'];
};

export type IPurchaseOrderProduct = {
  discount?: Maybe<Scalars['Float']['output']>;
  price: Scalars['Float']['output'];
  product: IProduct;
  quantity: Scalars['Int']['output'];
  receivedQuantity?: Maybe<Scalars['Int']['output']>;
  size?: Maybe<Scalars['String']['output']>;
  taxes: Array<Maybe<ITaxType>>;
  total: Scalars['Float']['output'];
};

export type IPurchaseOrderProductInput = {
  discount: Scalars['Float']['input'];
  price: Scalars['Float']['input'];
  product: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  size?: InputMaybe<Scalars['String']['input']>;
  taxes: Array<InputMaybe<ITaxInput>>;
  total: Scalars['Float']['input'];
};

export enum IPurchaseOrderStatus {
  Approved = 'approved',
  Cancelled = 'cancelled',
  Delivered = 'delivered',
  Pending = 'pending',
  Rejected = 'rejected',
  Sent = 'sent'
}

export type IPurchaseQuotation = {
  _id: Scalars['ID']['output'];
  attachment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['ID']['output']>;
  createdByType?: Maybe<Scalars['String']['output']>;
  deliveryDate?: Maybe<Scalars['Date']['output']>;
  paymentTerms?: Maybe<Scalars['String']['output']>;
  products: Array<IPurchaseQuotationProduct>;
  referenceNumber: Scalars['String']['output'];
  rfq?: Maybe<IRfq>;
  shippingAddress?: Maybe<Scalars['String']['output']>;
  status: IQuotationStatus;
  supplier: IUser;
  totals: IProductTotals;
  updatedAt: Scalars['Date']['output'];
  validityDate?: Maybe<Scalars['Date']['output']>;
};

export type IPurchaseQuotationProduct = {
  discount: Scalars['Float']['output'];
  price: Scalars['Float']['output'];
  product?: Maybe<IProduct>;
  quantity: Scalars['Int']['output'];
  size?: Maybe<Scalars['String']['output']>;
  taxes: Array<Maybe<ITaxType>>;
  total: Scalars['Float']['output'];
};

export type IPurchaseQuotationProductInput = {
  discount: Scalars['Float']['input'];
  price: Scalars['Float']['input'];
  product: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  size?: InputMaybe<Scalars['String']['input']>;
  taxes: Array<InputMaybe<ITaxInput>>;
  total: Scalars['Float']['input'];
};

export type IPurchaseReceived = {
  _id: Scalars['ID']['output'];
  attachment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy: Scalars['ID']['output'];
  createdByType: Scalars['String']['output'];
  enterprise: Scalars['ID']['output'];
  orderDate: Scalars['Date']['output'];
  orderReferenceNumber: Scalars['String']['output'];
  products: Array<IPurchaseReceivedProduct>;
  purchaseOrder?: Maybe<IPurchaseOrder>;
  receivedDate: Scalars['Date']['output'];
  referenceNumber: Scalars['String']['output'];
  remarks?: Maybe<Scalars['String']['output']>;
  supplier: ISupplier;
  totals: IProductTotals;
  updatedAt: Scalars['Date']['output'];
};

export type IPurchaseReceivedProduct = {
  orderedQuantity: Scalars['Int']['output'];
  product: IProduct;
  receivedQuantity: Scalars['Int']['output'];
  size?: Maybe<Scalars['String']['output']>;
  total: Scalars['Float']['output'];
};

export type IPurchaseReceivedProductInput = {
  orderedQuantity: Scalars['Int']['input'];
  product: Scalars['ID']['input'];
  receivedQuantity: Scalars['Int']['input'];
  size?: InputMaybe<Scalars['String']['input']>;
  total: Scalars['Float']['input'];
};

export enum IPurchaseReceivedStatus {
  Closed = 'closed',
  FullyReceived = 'fully_received',
  PartiallyReceived = 'partially_received',
  Pending = 'pending'
}

export type IPurchaseReturn = {
  _id: Scalars['ID']['output'];
  attachment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy: Scalars['ID']['output'];
  createdByType: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  orderReferenceNumber: Scalars['String']['output'];
  products: Array<IPurchaseReturnProduct>;
  purchaseReceived?: Maybe<IPurchaseReceived>;
  receivedDate: Scalars['Date']['output'];
  referenceNumber: Scalars['String']['output'];
  status: IPurchaseReturnStatus;
  supplier: ISupplier;
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type IPurchaseReturnFilterInput = {
  endDate?: InputMaybe<Scalars['Date']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type IPurchaseReturnProduct = {
  orderedQuantity: Scalars['Int']['output'];
  product: IProduct;
  reason: IPurchaseReturnReason;
  receivedQuantity: Scalars['Int']['output'];
  returnQuantity: Scalars['Int']['output'];
  size?: Maybe<Scalars['String']['output']>;
  total: Scalars['Float']['output'];
};

export type IPurchaseReturnProductInput = {
  orderedQuantity: Scalars['Int']['input'];
  product: Scalars['ID']['input'];
  reason: IPurchaseReturnReason;
  receivedQuantity: Scalars['Int']['input'];
  returnQuantity: Scalars['Int']['input'];
  size?: InputMaybe<Scalars['String']['input']>;
  total: Scalars['Float']['input'];
};

export enum IPurchaseReturnReason {
  Damaged = 'damaged',
  Used = 'used'
}

export enum IPurchaseReturnStatus {
  Approved = 'approved',
  Pending = 'pending',
  Received = 'received',
  Rejected = 'rejected'
}

export type IQuery = {
  allApprecication?: Maybe<Array<Maybe<IAppreciation>>>;
  allAttendance?: Maybe<Array<Maybe<IAttendance>>>;
  allLeaves?: Maybe<Array<Maybe<ILeave>>>;
  allPayroll?: Maybe<Array<Maybe<IPayroll>>>;
  attendance?: Maybe<IAttendance>;
  attendancesHistory?: Maybe<Array<Maybe<IAttendance>>>;
  creates?: Maybe<IPerformanceReview>;
  currentCustomer: ICustomer;
  currentEmployee?: Maybe<IEmployee>;
  currentEnterprise?: Maybe<IEnterprise>;
  currentSupplier: ISupplier;
  deletePerformanceReview?: Maybe<Scalars['Boolean']['output']>;
  departments?: Maybe<Array<Maybe<IDepartment>>>;
  employee?: Maybe<IEmployee>;
  employeePayroll?: Maybe<Array<Maybe<IPayroll>>>;
  employees: IEmployeesResponse;
  getAdmins: Array<Maybe<IAdmin>>;
  getAllEnterpriseJobs: IAllEnterpriseJobsResponse;
  getApp?: Maybe<IApp>;
  getAppointmentById?: Maybe<IAppointment>;
  getAppointments: Array<IAppointment>;
  getApps?: Maybe<Array<Maybe<IApp>>>;
  getBranchById?: Maybe<IBranch>;
  getBranches: Array<IBranch>;
  getContact?: Maybe<IContact>;
  getContacts: Array<Maybe<IContact>>;
  getCountries: Array<ICountry>;
  getCustomer: ICustomer;
  getCustomerContacts?: Maybe<Array<IContact>>;
  getCustomerRFQById?: Maybe<ICustomerRfq>;
  getCustomerRFQs: Array<ICustomerRfq>;
  getCustomers: Array<ICustomer>;
  getEmployeeById?: Maybe<IEmployee>;
  getEnterprise?: Maybe<IEnterprise>;
  getEnterpriseByEmail?: Maybe<IEnterprise>;
  getEnterpriseCurrency?: Maybe<Scalars['String']['output']>;
  getEnterprises: IEnterpriseConnection;
  getHrmConfig?: Maybe<IHrmConfig>;
  getInsights: IInsights;
  getLead?: Maybe<ILead>;
  getLeads: Array<Maybe<ILead>>;
  getMetrics: IMetrics;
  getMyCustomers: Array<Maybe<ICustomer>>;
  getMySupportTickets: Array<ISupportTicket>;
  getMyTasks: Array<ITask>;
  getOverTimeRequests?: Maybe<Array<Maybe<IAttendance>>>;
  getPOSOrderById?: Maybe<IPosOrder>;
  getPOSOrders: IGetPosOrdersResponse;
  getPOSRegisterById?: Maybe<IPosRegister>;
  getPOSRegisters: Array<IPosRegister>;
  getPOSReturnById?: Maybe<IPosReturn>;
  getPOSReturns: IPosReturnResponse;
  getPOSTerminalBillers: Array<IPosTerminalBiller>;
  getPOSTerminalById?: Maybe<IPosTerminal>;
  getPOSTerminals: Array<IPosTerminal>;
  getPackage?: Maybe<IPackage>;
  getPackages: Array<IPackage>;
  getProductById?: Maybe<IProduct>;
  getProductConfig?: Maybe<IProductConfig>;
  getProducts: Array<IProduct>;
  getPurchaseInvoices: Array<IPurchaseOrder>;
  getPurchaseOrderById?: Maybe<IPurchaseOrder>;
  getPurchaseOrders: Array<IPurchaseOrder>;
  getPurchasePayments: Array<IPurchaseOrderPayment>;
  getPurchaseQuotationById?: Maybe<IPurchaseQuotation>;
  getPurchaseQuotations: Array<IPurchaseQuotation>;
  getPurchaseReceivedById?: Maybe<IPurchaseReceived>;
  getPurchaseReceiveds: Array<IPurchaseReceived>;
  getPurchaseReturnById?: Maybe<IPurchaseReturn>;
  getPurchaseReturns: Array<IPurchaseReturn>;
  getPurchaseReturnsBySupplier: Array<IPurchaseReturn>;
  getRfqById?: Maybe<IRfq>;
  getRfqs: Array<IRfq>;
  getSaleInvoiceById?: Maybe<ISalesOrder>;
  getSaleInvoices: Array<ISalesOrder>;
  getSalePayments: Array<ISaleOrderPayment>;
  getSaleQuotationById?: Maybe<ISaleQuotation>;
  getSaleQuotations: Array<ISaleQuotation>;
  getSalesOrderById?: Maybe<ISalesOrder>;
  getSalesOrders: Array<ISalesOrder>;
  getSalesReturnById?: Maybe<ISalesReturn>;
  getSalesReturns: Array<ISalesReturn>;
  getServiceAppointments: Array<IAppointment>;
  getServiceById?: Maybe<IService>;
  getServiceConfig?: Maybe<IServiceConfig>;
  getServiceInvoices: Array<IAppointment>;
  getServices: Array<IService>;
  getSubscription?: Maybe<ISubscription>;
  getSubscriptions: ISubscriptionConnection;
  getSupplier: ISupplier;
  getSupplierQuotations: Array<Maybe<IPurchaseQuotation>>;
  getSupplierRfqs: Array<IRfq>;
  getSuppliers: Array<ISupplier>;
  getSupportTickets: Array<ISupportTicket>;
  getSystem: ISystem;
  getTotalWorkingDays: Scalars['Int']['output'];
  jobCandidates: IRecruitmentCandidateResponse;
  me?: Maybe<IAdmin>;
  myAppreciation?: Maybe<Array<Maybe<IAppreciation>>>;
  myLeaves?: Maybe<Array<Maybe<ILeave>>>;
  myPayroll?: Maybe<IPayroll>;
  recruitmentJob?: Maybe<IRecruitmentJob>;
  recruitmentJobs: Array<IRecruitmentJob>;
  updatePerformanceReview?: Maybe<IPerformanceReview>;
};


export type IQueryAllAttendanceArgs = {
  date: Scalars['Date']['input'];
};


export type IQueryAttendanceArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryAttendancesHistoryArgs = {
  employeeId: Scalars['ID']['input'];
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};


export type IQueryCreatesArgs = {
  input: IPerformanceReviewInput;
};


export type IQueryDeletePerformanceReviewArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryEmployeeArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryEmployeePayrollArgs = {
  employeeId?: InputMaybe<Scalars['ID']['input']>;
};


export type IQueryEmployeesArgs = {
  pagination?: InputMaybe<IPaginationInput>;
  permissions?: InputMaybe<Array<InputMaybe<IPermissions>>>;
  status?: InputMaybe<IEmployeeStatusType>;
};


export type IQueryGetAllEnterpriseJobsArgs = {
  enterpriseId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type IQueryGetAppArgs = {
  id: Scalars['ObjectId']['input'];
};


export type IQueryGetAppointmentByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetAppointmentsArgs = {
  date?: InputMaybe<Scalars['Int']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type IQueryGetBranchByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetContactArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetCustomerContactsArgs = {
  customerId: Scalars['ID']['input'];
};


export type IQueryGetCustomerRfqByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetEmployeeByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetEnterpriseArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetEnterpriseByEmailArgs = {
  email: Scalars['String']['input'];
};


export type IQueryGetEnterprisesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type IQueryGetLeadArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetPosOrderByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetPosOrdersArgs = {
  branchId?: InputMaybe<Scalars['ID']['input']>;
  orderNumber?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<IPaginationInput>;
  posTerminalId?: InputMaybe<Scalars['ID']['input']>;
};


export type IQueryGetPosRegisterByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetPosRegistersArgs = {
  month: Scalars['Int']['input'];
  posTerminalId: Scalars['ID']['input'];
  year: Scalars['Int']['input'];
};


export type IQueryGetPosReturnByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetPosReturnsArgs = {
  filter?: InputMaybe<IPosReturnFilterInput>;
  pagination?: InputMaybe<IPaginationInput>;
};


export type IQueryGetPosTerminalBillersArgs = {
  branchId?: InputMaybe<Scalars['ID']['input']>;
};


export type IQueryGetPosTerminalByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetPosTerminalsArgs = {
  branchId?: InputMaybe<Scalars['ID']['input']>;
};


export type IQueryGetPackageArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetProductByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetProductsArgs = {
  input?: InputMaybe<IProductFilterInput>;
};


export type IQueryGetPurchaseInvoicesArgs = {
  month?: InputMaybe<Scalars['Int']['input']>;
  user?: InputMaybe<IUserType>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type IQueryGetPurchaseOrderByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetPurchasePaymentsArgs = {
  filter?: InputMaybe<Scalars['JSON']['input']>;
};


export type IQueryGetPurchaseQuotationByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetPurchaseReceivedByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetPurchaseReturnByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetPurchaseReturnsArgs = {
  filter?: InputMaybe<IPurchaseReturnFilterInput>;
};


export type IQueryGetPurchaseReturnsBySupplierArgs = {
  supplierId: Scalars['ID']['input'];
};


export type IQueryGetRfqByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetSaleInvoiceByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetSaleInvoicesArgs = {
  status?: InputMaybe<IOrderInvoiceStatus>;
};


export type IQueryGetSalePaymentsArgs = {
  filter?: InputMaybe<Scalars['JSON']['input']>;
};


export type IQueryGetSaleQuotationByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetSaleQuotationsArgs = {
  status?: InputMaybe<IQuotationStatus>;
};


export type IQueryGetSalesOrderByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetSalesOrdersArgs = {
  filter?: InputMaybe<Scalars['JSON']['input']>;
};


export type IQueryGetSalesReturnByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetSalesReturnsArgs = {
  status?: InputMaybe<ISalesReturnStatus>;
};


export type IQueryGetServiceAppointmentsArgs = {
  date?: InputMaybe<Scalars['Int']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
  serviceId?: InputMaybe<Scalars['ID']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type IQueryGetServiceByIdArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetServiceInvoicesArgs = {
  month?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type IQueryGetSubscriptionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type IQueryGetSupplierArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryGetTotalWorkingDaysArgs = {
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};


export type IQueryJobCandidatesArgs = {
  jobId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type IQueryRecruitmentJobArgs = {
  id: Scalars['ID']['input'];
};


export type IQueryRecruitmentJobsArgs = {
  enterpriseId?: InputMaybe<Scalars['ID']['input']>;
};


export type IQueryUpdatePerformanceReviewArgs = {
  id: Scalars['ID']['input'];
  input: IPerformanceReviewInput;
};

export type IQuotationInput = {
  attachment?: InputMaybe<Scalars['String']['input']>;
  deliveryDate?: InputMaybe<Scalars['Date']['input']>;
  paymentTerms?: InputMaybe<Scalars['String']['input']>;
  products: Array<IPurchaseQuotationProductInput>;
  rfq?: InputMaybe<Scalars['ID']['input']>;
  supplier: Scalars['ID']['input'];
  totals: IProductTotalsInput;
  validityDate?: InputMaybe<Scalars['Date']['input']>;
};

export enum IQuotationStatus {
  Approved = 'approved',
  Pending = 'pending',
  Rejected = 'rejected'
}

export type IRfq = {
  _id?: Maybe<Scalars['String']['output']>;
  approvedBy?: Maybe<Array<Maybe<IUser>>>;
  createdAt: Scalars['Date']['output'];
  createdByType?: Maybe<ICreatedByType>;
  dueDate?: Maybe<Scalars['Date']['output']>;
  enterprise?: Maybe<Scalars['String']['output']>;
  products?: Maybe<Array<Maybe<IRfqProductsType>>>;
  referenceNumber: Scalars['String']['output'];
  rejectedby?: Maybe<Array<Maybe<IUser>>>;
  status?: Maybe<IRfqStatus>;
  suppliers?: Maybe<Array<Maybe<ISupplier>>>;
};

export type IRfqProductsInupt = {
  product: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  size?: InputMaybe<Scalars['String']['input']>;
};

export type IRfqProductsType = {
  product?: Maybe<IProduct>;
  quantity: Scalars['Int']['output'];
  size?: Maybe<Scalars['String']['output']>;
};

export enum IRfqStatus {
  Active = 'active',
  Closed = 'closed'
}

export type IRecruitmentCandidate = {
  _id: Scalars['ObjectId']['output'];
  coverLetter?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  email: Scalars['String']['output'];
  enterprise: IEnterprise;
  gender: Scalars['String']['output'];
  interviewAt?: Maybe<Scalars['Date']['output']>;
  interviewLocation?: Maybe<Scalars['String']['output']>;
  interviewMeetLink?: Maybe<Scalars['String']['output']>;
  interviewer?: Maybe<IInterviewer>;
  job: IRecruitmentJob;
  linkedIn?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  resume: Scalars['String']['output'];
  status: IRecruitmentCandidateStatus;
  totalExperience: Scalars['Float']['output'];
  website?: Maybe<Scalars['String']['output']>;
};

export type IRecruitmentCandidateInput = {
  coverLetter?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  gender: Scalars['String']['input'];
  jobId: Scalars['ID']['input'];
  linkedIn?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  resume: Scalars['String']['input'];
  status: IRecruitmentCandidateStatus;
  totalExperience: Scalars['Float']['input'];
  website?: InputMaybe<Scalars['String']['input']>;
};

export type IRecruitmentCandidateResponse = {
  candidates: Array<IRecruitmentCandidate>;
  jobTitle: Scalars['String']['output'];
  pageInfo: IPaginationInfo;
};

export enum IRecruitmentCandidateStatus {
  Applied = 'applied',
  Hired = 'hired',
  Interviewing = 'interviewing',
  Rejected = 'rejected'
}

export type IRecruitmentJob = {
  _id: Scalars['ObjectId']['output'];
  candidates?: Maybe<Array<Maybe<IRecruitmentCandidate>>>;
  closingDate: Scalars['Date']['output'];
  createdAt: Scalars['Date']['output'];
  description: Scalars['String']['output'];
  enterprise?: Maybe<IEnterprise>;
  location: Scalars['String']['output'];
  status: IRecruitmentJobStatus;
  title: Scalars['String']['output'];
  totalCandidates: Scalars['Int']['output'];
};

export type IRecruitmentJobInput = {
  closingDate: Scalars['Date']['input'];
  description: Scalars['String']['input'];
  location: Scalars['String']['input'];
  status: IRecruitmentJobStatus;
  title: Scalars['String']['input'];
};

export enum IRecruitmentJobStatus {
  Closed = 'closed',
  Open = 'open'
}

export enum ISalaryCycle {
  BiWeekly = 'bi_weekly',
  Daily = 'daily',
  Monthly = 'monthly',
  SemiMonthly = 'semi_monthly',
  Weekly = 'weekly'
}

export type ISalaryDetails = {
  allowances?: Maybe<Array<Maybe<ICustomField>>>;
  basicPay?: Maybe<Scalars['Int']['output']>;
  deductions?: Maybe<Array<Maybe<ICustomField>>>;
};

export type ISalaryDetailsInput = {
  allowances?: InputMaybe<Array<InputMaybe<ICustomFieldInput>>>;
  basicPay: Scalars['Int']['input'];
  deductions?: InputMaybe<Array<InputMaybe<ICustomFieldInput>>>;
};

export type ISaleOrderPayment = {
  _id: Scalars['ID']['output'];
  amountPaid: Scalars['Float']['output'];
  createdAt: Scalars['Date']['output'];
  customer: IUser;
  enterprise: Scalars['ID']['output'];
  paymentDate?: Maybe<Scalars['Date']['output']>;
  paymentMethod: IPaymentMethod;
  paymentNote?: Maybe<Scalars['String']['output']>;
  paymentNumber: Scalars['String']['output'];
  paymentStatus: IPaymentStatus;
  salesOrder: Scalars['ID']['output'];
  salesOrderNumber: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type ISaleQuotation = {
  _id: Scalars['ID']['output'];
  attachment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy: Scalars['ID']['output'];
  createdByType: ICreatedByType;
  customer: ICustomer;
  deliveryDate: Scalars['Date']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  products: Array<ISaleQuotationProduct>;
  quotationNumber: Scalars['String']['output'];
  rfqNumber?: Maybe<Scalars['String']['output']>;
  status: IQuotationStatus;
  totals: IProductTotals;
  updatedAt: Scalars['Date']['output'];
  validityDate: Scalars['Date']['output'];
};

export type ISaleQuotationProduct = {
  discount?: Maybe<Scalars['Float']['output']>;
  price: Scalars['Float']['output'];
  product: IProduct;
  quantity: Scalars['Int']['output'];
  size?: Maybe<Scalars['String']['output']>;
  taxes: Array<Maybe<ITaxType>>;
  total: Scalars['Float']['output'];
};

export type ISaleQuotationProductInput = {
  discount: Scalars['Float']['input'];
  price: Scalars['Float']['input'];
  product: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  size?: InputMaybe<Scalars['String']['input']>;
  taxes: Array<InputMaybe<ITaxInput>>;
  total: Scalars['Float']['input'];
};

export type ISalesOrder = {
  _id: Scalars['ID']['output'];
  amountPaid?: Maybe<Scalars['Float']['output']>;
  amountRemaining?: Maybe<Scalars['Float']['output']>;
  attachment?: Maybe<Scalars['String']['output']>;
  billingAddress: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  createdBy: Scalars['ID']['output'];
  createdByType: ICreatedByType;
  customer: ICustomer;
  deliveryAssigned?: Maybe<IUser>;
  deliveryDate?: Maybe<Scalars['Date']['output']>;
  invoiceStatus: IOrderInvoiceStatus;
  notes?: Maybe<Scalars['String']['output']>;
  orderDate?: Maybe<Scalars['Date']['output']>;
  orderNumber: Scalars['String']['output'];
  paymentTerms?: Maybe<Scalars['String']['output']>;
  products: Array<ISalesOrderProduct>;
  quotation?: Maybe<Scalars['ID']['output']>;
  quotationNumber?: Maybe<Scalars['String']['output']>;
  receivedDate?: Maybe<Scalars['Date']['output']>;
  shippingAddress: Scalars['String']['output'];
  status: ISalesOrderStatus;
  totals: IProductTotals;
  updatedAt: Scalars['Date']['output'];
};

export type ISalesOrderProduct = {
  discount?: Maybe<Scalars['Float']['output']>;
  price: Scalars['Float']['output'];
  product: IProduct;
  quantity: Scalars['Int']['output'];
  size?: Maybe<Scalars['String']['output']>;
  taxes: Array<Maybe<ITaxType>>;
  total: Scalars['Float']['output'];
};

export type ISalesOrderProductInput = {
  discount?: InputMaybe<Scalars['Float']['input']>;
  price: Scalars['Float']['input'];
  product: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  size?: InputMaybe<Scalars['String']['input']>;
  taxes: Array<InputMaybe<ITaxInput>>;
  total: Scalars['Float']['input'];
};

export enum ISalesOrderStatus {
  Approved = 'approved',
  Cancelled = 'cancelled',
  Completed = 'completed',
  Delivered = 'delivered',
  Pending = 'pending',
  Rejected = 'rejected',
  Sent = 'sent'
}

export type ISalesReturn = {
  _id: Scalars['ID']['output'];
  attachment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy: Scalars['ID']['output'];
  createdByType: ICreatedByType;
  customer: ICustomer;
  notes?: Maybe<Scalars['String']['output']>;
  orderDate: Scalars['Date']['output'];
  orderNumber: Scalars['String']['output'];
  orderReceivedDate: Scalars['Date']['output'];
  products: Array<ISalesReturnProduct>;
  returnDate: Scalars['Date']['output'];
  returnNumber: Scalars['String']['output'];
  salesOrder: ISalesOrder;
  status: ISalesReturnStatus;
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type ISalesReturnProduct = {
  orderedQuantity: Scalars['Int']['output'];
  price: Scalars['Float']['output'];
  product: IProduct;
  reason: Scalars['String']['output'];
  returnQuantity: Scalars['Int']['output'];
  size?: Maybe<Scalars['String']['output']>;
  taxes: Array<Maybe<ITaxType>>;
  total: Scalars['Float']['output'];
};

export type ISalesReturnProductInput = {
  orderedQuantity: Scalars['Int']['input'];
  price: Scalars['Float']['input'];
  product: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
  returnQuantity: Scalars['Int']['input'];
  size?: InputMaybe<Scalars['String']['input']>;
  total: Scalars['Float']['input'];
};

export enum ISalesReturnStatus {
  Approved = 'approved',
  Completed = 'completed',
  Pending = 'pending',
  Rejected = 'rejected'
}

export type IService = {
  _id: Scalars['ID']['output'];
  appointments?: Maybe<Array<Maybe<IAppointment>>>;
  category?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy: IUser;
  createdByType: ICreatedByType;
  description?: Maybe<Scalars['String']['output']>;
  duration: IServiceduration;
  image?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  pricing: Scalars['Float']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type IServiceConfig = {
  _id: Scalars['ID']['output'];
  availableDays: Array<Scalars['Int']['output']>;
  availableHours: IAvailableHours;
  breakTimes: Array<IBreakTime>;
  createdAt: Scalars['Date']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type IServiceConfigInput = {
  availableDays: Array<Scalars['Int']['input']>;
  availableHours: IAvailableHoursInput;
  breakTimes: Array<IBreakTimeInput>;
};

export type IServiceInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  duration: IServiceduration;
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  pricing: Scalars['Float']['input'];
};

export enum IServiceduration {
  Daily = 'daily',
  Hourly = 'hourly',
  Monthly = 'monthly',
  OneTime = 'oneTime',
  Weekly = 'weekly'
}

export type IShift = {
  end: Scalars['String']['output'];
  id: Scalars['String']['output'];
  shiftName: Scalars['String']['output'];
  start: Scalars['String']['output'];
  workDays: Array<Scalars['String']['output']>;
};

export type IShiftInput = {
  end: Scalars['String']['input'];
  id: Scalars['String']['input'];
  shiftName: Scalars['String']['input'];
  start: Scalars['String']['input'];
  workDays?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ISubscription = {
  _id: Scalars['ObjectId']['output'];
  apps?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  billingCycle?: Maybe<IBillingCycle>;
  branchesLimits?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  endDate: Scalars['Date']['output'];
  enterpriseId: Scalars['ObjectId']['output'];
  isCustomPackage?: Maybe<Scalars['Boolean']['output']>;
  packageID?: Maybe<Scalars['ObjectId']['output']>;
  paymentMethod?: Maybe<IPaymentMethod>;
  price: Scalars['Float']['output'];
  startDate?: Maybe<Scalars['Date']['output']>;
  status: ISubscriptionStatus;
  stripePriceID?: Maybe<Scalars['ObjectId']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
  updatedBy?: Maybe<ISubscriptionUpdatedBy>;
  usersLimits?: Maybe<Scalars['Int']['output']>;
};

export type ISubscriptionConnection = {
  pageInfo: IPaginationInfo;
  subscriptions: Array<ISubscriptions>;
};

export enum ISubscriptionStatus {
  Active = 'active',
  Declined = 'declined',
  Expired = 'expired',
  Pending = 'pending',
  Trial = 'trial'
}

export type ISubscriptionUpdatedBy = {
  date?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type ISubscriptions = {
  _id: Scalars['ObjectId']['output'];
  apps?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  billingCycle?: Maybe<IBillingCycle>;
  branchesLimits?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Date']['output'];
  deletedAt?: Maybe<Scalars['Date']['output']>;
  endDate: Scalars['Date']['output'];
  enterprise?: Maybe<IEnterprise>;
  isCustomPackage?: Maybe<Scalars['Boolean']['output']>;
  packageID: Scalars['ObjectId']['output'];
  price: Scalars['Float']['output'];
  startDate: Scalars['Date']['output'];
  status: ISubscriptionStatus;
  stripePriceID?: Maybe<Scalars['ObjectId']['output']>;
  title: Scalars['String']['output'];
  trialEndDate?: Maybe<Scalars['Date']['output']>;
  updatedAt: Scalars['Date']['output'];
  usersLimits?: Maybe<Scalars['Int']['output']>;
};

export type ISupplier = {
  _id: Scalars['ID']['output'];
  allowLogin?: Maybe<Scalars['Boolean']['output']>;
  avatar?: Maybe<Scalars['String']['output']>;
  bankDetails?: Maybe<IBankAccount>;
  category?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<IUser>;
  email: Scalars['String']['output'];
  location?: Maybe<ILocation>;
  mobileNumber?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  objective?: Maybe<Scalars['String']['output']>;
  paymentMethod?: Maybe<IPaymentMethod>;
  phoneNumber: Scalars['String']['output'];
  stats?: Maybe<IPaymentReceivedStats>;
  status?: Maybe<IUserStatus>;
  updatedAt: Scalars['Date']['output'];
  userName: Scalars['String']['output'];
};

export type ISupplierInput = {
  allowLogin?: InputMaybe<Scalars['Boolean']['input']>;
  avatar?: InputMaybe<Scalars['String']['input']>;
  bankDetails?: InputMaybe<IBankAccountInput>;
  category?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  location?: InputMaybe<ILocationInput>;
  mobileNumber?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  objective?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  paymentMethod: IPaymentMethod;
  phoneNumber: Scalars['String']['input'];
  status?: InputMaybe<IUserStatus>;
  userName: Scalars['String']['input'];
};

export type ISupportTicket = {
  _id: Scalars['ID']['output'];
  assignedTo?: Maybe<IUser>;
  assignedToType?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  customer: IUser;
  description: Scalars['String']['output'];
  enterprise: Scalars['ID']['output'];
  messages: Array<ISupportTicketMessage>;
  priority: IPriority;
  status: ISupportTicketStatus;
  subject: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type ISupportTicketInput = {
  description: Scalars['String']['input'];
  priority: IPriority;
  subject: Scalars['String']['input'];
};

export type ISupportTicketMessage = {
  date: Scalars['Date']['output'];
  id: Scalars['String']['output'];
  message: Scalars['String']['output'];
  sender: Scalars['String']['output'];
};

export type ISupportTicketMessageInput = {
  id: Scalars['String']['input'];
  message: Scalars['String']['input'];
  sender: Scalars['String']['input'];
};

export enum ISupportTicketStatus {
  Closed = 'closed',
  InProgress = 'inProgress',
  Open = 'open'
}

export type ISupportTicketStatusUpdateInput = {
  _id: Scalars['ID']['input'];
  status: ISupportTicketStatus;
};

export type ISystem = {
  contacts?: Maybe<IContacts>;
  darkLogo?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  heading: Scalars['String']['output'];
  lightLogo: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ISystemInput = {
  contacts?: InputMaybe<IContactsInput>;
  darkLogo?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  heading: Scalars['String']['input'];
  lightLogo: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type ITask = {
  _id: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['Date']['output']>;
  priority: ITaskPriority;
  status: ITaskStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ITaskInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<ITaskPriority>;
  title: Scalars['String']['input'];
};

export enum ITaskPriority {
  High = 'high',
  Low = 'low',
  Medium = 'medium'
}

export enum ITaskStatus {
  Completed = 'completed',
  Draft = 'draft',
  InProgress = 'inProgress'
}

export type ITaskStatusUpdateInput = {
  _id: Scalars['ID']['input'];
  status: ITaskStatus;
};

export type ITaxInput = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  rate: Scalars['Float']['input'];
};

export type ITaxType = {
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  rate: Scalars['Float']['output'];
};

export type IUpdateEnterpriseInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  barcode?: InputMaybe<Scalars['String']['input']>;
  branches?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  businessHours?: InputMaybe<IBusinessHoursInput>;
  city?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  dateFormat?: InputMaybe<Scalars['String']['input']>;
  domain?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  establishDate?: InputMaybe<Scalars['Date']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<ILocationInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  positions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  registrationNumber?: InputMaybe<Scalars['String']['input']>;
  subDomain?: InputMaybe<Scalars['String']['input']>;
  subscriptionAuto?: InputMaybe<Scalars['Boolean']['input']>;
  taxID?: InputMaybe<Scalars['String']['input']>;
  timeZone?: InputMaybe<Scalars['String']['input']>;
  warehouses?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type IUser = {
  _id?: Maybe<Scalars['ObjectId']['output']>;
  avatar?: Maybe<Scalars['String']['output']>;
  branch?: Maybe<IBranch>;
  company?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  employeId?: Maybe<Scalars['String']['output']>;
  industry?: Maybe<Scalars['String']['output']>;
  isWalkIn?: Maybe<Scalars['Boolean']['output']>;
  mobileNumber?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  position?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
};

export enum IUserStatus {
  Active = 'active',
  Inactive = 'inactive'
}

export enum IUserType {
  Customer = 'customer',
  Employee = 'employee',
  Enterprise = 'enterprise',
  PosOperator = 'posOperator',
  Supplier = 'supplier',
  User = 'user'
}

export type IVerifyEmployeeFieldsInput = {
  employeeId?: InputMaybe<Scalars['ObjectId']['input']>;
  socialSecurityNumber?: InputMaybe<Scalars['String']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
};

export type IWarehouse = {
  _id: Scalars['ObjectId']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type ICheckInOrOutWithUserNameResponse = {
  attendance: IAttendance;
  employee: IEmployee;
  status: ICheckInOrOutWithUserNameResponseStatus;
};

export enum ICheckInOrOutWithUserNameResponseStatus {
  CheckIn = 'checkIn',
  CheckOut = 'checkOut'
}

export type ICreateSubScriptionInput = {
  apps: Array<ICreateSubScriptionAppInput>;
  branchesLimits: Scalars['Int']['input'];
  description: Scalars['String']['input'];
  isCustomPackage?: InputMaybe<Scalars['Boolean']['input']>;
  packageID: Scalars['String']['input'];
  redirectUrl: Scalars['String']['input'];
  stripePriceID?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  usersLimits: Scalars['Int']['input'];
};

export type IGetPosOrdersResponse = {
  orders: Array<IPosOrder>;
  pageInfo: IPaginationInfo;
};

export type IIsValueExistResponse = {
  isExist: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
};

export type IDeleteBranchMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type IDeleteBranchMutationResult = { deleteBranch: boolean };

export type IGetAppQueryVariables = Exact<{
  id: Scalars['ObjectId']['input'];
}>;


export type IGetAppQueryResult = { getApp?: { title?: string | null } | null };

export type IGetBranchesQueryVariables = Exact<{ [key: string]: never; }>;


export type IGetBranchesQueryResult = { getBranches: Array<{ _id: string, name?: string | null }> };

export type IMyLeavesQueryVariables = Exact<{ [key: string]: never; }>;


export type IMyLeavesQueryResult = { myLeaves?: Array<{ startDate: any, endDate: any, type: ILeaveType, _id: any, reason: string, status: ILeaveStatus } | null> | null };


export const DeleteBranchDocument = gql`
    mutation DeleteBranch($id: ID!) {
  deleteBranch(id: $id)
}
    `;

/**
 * __useDeleteBranchMutation__
 *
 * To run a mutation, you first call `useDeleteBranchMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBranchMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteBranchMutation({
 *   variables: {
 *     id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBranchMutation(options: UseMutationOptions<IDeleteBranchMutationResult, IDeleteBranchMutationVariables> | ReactiveFunction<UseMutationOptions<IDeleteBranchMutationResult, IDeleteBranchMutationVariables>> = {}) {
  return useMutation<IDeleteBranchMutationResult, IDeleteBranchMutationVariables>(DeleteBranchDocument, options);
}
export type DeleteBranchMutationCompositionFunctionResult = UseMutationReturn<IDeleteBranchMutationResult, IDeleteBranchMutationVariables>;
export const GetAppDocument = gql`
    query GetApp($id: ObjectId!) {
  getApp(id: $id) {
    title
  }
}
    `;

/**
 * __useGetAppQuery__
 *
 * To run a query within a Vue component, call `useGetAppQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetAppQuery({
 *   id: // value for 'id'
 * });
 */
export function useGetAppQuery(variables: IGetAppQueryVariables | VueCompositionApi.Ref<IGetAppQueryVariables> | ReactiveFunction<IGetAppQueryVariables>, options: UseQueryOptions<IGetAppQueryResult, IGetAppQueryVariables> | VueCompositionApi.Ref<UseQueryOptions<IGetAppQueryResult, IGetAppQueryVariables>> | ReactiveFunction<UseQueryOptions<IGetAppQueryResult, IGetAppQueryVariables>> = {}) {
  return useQuery<IGetAppQueryResult, IGetAppQueryVariables>(GetAppDocument, variables, options);
}
export function useGetAppLazyQuery(variables?: IGetAppQueryVariables | VueCompositionApi.Ref<IGetAppQueryVariables> | ReactiveFunction<IGetAppQueryVariables>, options: UseQueryOptions<IGetAppQueryResult, IGetAppQueryVariables> | VueCompositionApi.Ref<UseQueryOptions<IGetAppQueryResult, IGetAppQueryVariables>> | ReactiveFunction<UseQueryOptions<IGetAppQueryResult, IGetAppQueryVariables>> = {}) {
  return useLazyQuery<IGetAppQueryResult, IGetAppQueryVariables>(GetAppDocument, variables, options);
}
export type GetAppQueryCompositionFunctionResult = UseQueryReturn<IGetAppQueryResult, IGetAppQueryVariables>;
export const GetBranchesDocument = gql`
    query GetBranches {
  getBranches {
    _id
    name
  }
}
    `;

/**
 * __useGetBranchesQuery__
 *
 * To run a query within a Vue component, call `useGetBranchesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBranchesQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetBranchesQuery();
 */
export function useGetBranchesQuery(options: UseQueryOptions<IGetBranchesQueryResult, IGetBranchesQueryVariables> | VueCompositionApi.Ref<UseQueryOptions<IGetBranchesQueryResult, IGetBranchesQueryVariables>> | ReactiveFunction<UseQueryOptions<IGetBranchesQueryResult, IGetBranchesQueryVariables>> = {}) {
  return useQuery<IGetBranchesQueryResult, IGetBranchesQueryVariables>(GetBranchesDocument, {}, options);
}
export function useGetBranchesLazyQuery(options: UseQueryOptions<IGetBranchesQueryResult, IGetBranchesQueryVariables> | VueCompositionApi.Ref<UseQueryOptions<IGetBranchesQueryResult, IGetBranchesQueryVariables>> | ReactiveFunction<UseQueryOptions<IGetBranchesQueryResult, IGetBranchesQueryVariables>> = {}) {
  return useLazyQuery<IGetBranchesQueryResult, IGetBranchesQueryVariables>(GetBranchesDocument, {}, options);
}
export type GetBranchesQueryCompositionFunctionResult = UseQueryReturn<IGetBranchesQueryResult, IGetBranchesQueryVariables>;
export const MyLeavesDocument = gql`
    query MyLeaves {
  myLeaves {
    startDate
    endDate
    type
    _id
    reason
    status
  }
}
    `;

/**
 * __useMyLeavesQuery__
 *
 * To run a query within a Vue component, call `useMyLeavesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyLeavesQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useMyLeavesQuery();
 */
export function useMyLeavesQuery(options: UseQueryOptions<IMyLeavesQueryResult, IMyLeavesQueryVariables> | VueCompositionApi.Ref<UseQueryOptions<IMyLeavesQueryResult, IMyLeavesQueryVariables>> | ReactiveFunction<UseQueryOptions<IMyLeavesQueryResult, IMyLeavesQueryVariables>> = {}) {
  return useQuery<IMyLeavesQueryResult, IMyLeavesQueryVariables>(MyLeavesDocument, {}, options);
}
export function useMyLeavesLazyQuery(options: UseQueryOptions<IMyLeavesQueryResult, IMyLeavesQueryVariables> | VueCompositionApi.Ref<UseQueryOptions<IMyLeavesQueryResult, IMyLeavesQueryVariables>> | ReactiveFunction<UseQueryOptions<IMyLeavesQueryResult, IMyLeavesQueryVariables>> = {}) {
  return useLazyQuery<IMyLeavesQueryResult, IMyLeavesQueryVariables>(MyLeavesDocument, {}, options);
}
export type MyLeavesQueryCompositionFunctionResult = UseQueryReturn<IMyLeavesQueryResult, IMyLeavesQueryVariables>;