import { computed, inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { initialState } from './charge-algorithm.state';
import { ChargeParameter } from './charge-algorithm.model';

export const ChargeMaintenanceStore = signalStore(
  // 1. Initial State
  withState(initialState),

  // 2. Computed
  withComputed(({ records, selectedIndex }) => ({
    currentRecord: computed(() =>
      records()[selectedIndex()] ? structuredClone(records()[selectedIndex()]) : null,
    ),
  })),

  // 3. Methods
  withMethods((store) => {
    const loadMockData = () => {
      const mockData: ChargeParameter[] = [
        {
          id: '1',
          classId: '001',
          className: 'Sample Class',
          costRanges: Array(5).fill({
            lowEnd: 0,
            highEnd: 0,
            adminFee: 0,
            markupFactor: 0,
            minUnitCharge: 0,
          }),
        },
      ];

      patchState(store, { records: mockData });
    };

    const selectPrev = () => {
      patchState(store, (state) => ({
        ...state,
        selectedIndex: Math.max(0, state.selectedIndex - 1),
      }));
    };

    const selectNext = () => {
      patchState(store, (state) => {
        const max = state.records.length - 1;
        return {
          ...state,
          selectedIndex: Math.min(max, state.selectedIndex + 1),
        };
      });
    };

    const toggleEditMode = (value: boolean) => {
      patchState(store, { isEditMode: value });
    };

    const updateRecord = (updated: ChargeParameter) => {
      patchState(store, (state) => {
        const updatedRecords = [...state.records];
        updatedRecords[state.selectedIndex] = structuredClone(updated);
        return {
          ...state,
          records: updatedRecords,
          isEditMode: false,
        };
      });
    };

    return {
      loadMockData,
      selectPrev,
      selectNext,
      toggleEditMode,
      updateRecord,
    };
  }),
);
