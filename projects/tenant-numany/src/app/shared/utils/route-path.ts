/**
 * Defines all route paths as constants to prevent typos and enable easy refactoring.
 */
export const RoutePaths = {
  // Top-level routes
  Login: 'login',
  Patients: 'patients',
  Layout: '',

  // Child routes inside the layout
  Bed: 'bed',
  AdminSchedules: 'administration-schedules',
  ChargeAlgorithm: 'charge-algorithm',
  Departments: 'departments',
  ReportSelection: 'report-selection',
  ItemMaintenance: 'item-maintenance',
  FormularyItems: 'formulary-items',
  Physician: 'physician',
  SiteParameters: 'site-parameters',
  PharmInterventionTypeMaintenance: 'pharmacist-intervention-type-maintainance',
  PharmInterventionType: 'pharmacist-intervention-type',
  VendorSupplier: 'vendor-supplier',
  LabResultTypeMaintenance: 'lab-result-type-maintenance',
  RemoteInventoryLocation: 'remote-inventory-location',
  PatientPayorTypeMaintenance: 'patient-payor-type-maintenance',
  StandingOrders: 'standing-orders',
  AlertFileMatrix: 'alert-file-matrix',
  WardBedAreaMaintenance: 'ward-bed-area-maintenanace',
  DatabaseUsers: 'database-users',
};
