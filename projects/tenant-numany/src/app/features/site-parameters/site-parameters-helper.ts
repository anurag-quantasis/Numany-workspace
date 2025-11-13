import { FormControl, FormGroup, Validators } from '@angular/forms';
export interface GlobalWarmingPotentialModal {
  id: string;
  co2: number;
  ch4: number;
  n2o: number;
  status: number;
}

export class GlobalWarmingPotentialFormHelper {
  static createForm(data?: GlobalWarmingPotentialModal) {
    return new FormGroup({
      id: new FormControl(
        {
          value: data?.id,
          disabled: !(data?.id !== undefined || data?.id !== ''),
        },
        [],
      ),
      co2: new FormControl(data?.co2 ?? '', [Validators.required]),
      ch4: new FormControl(data?.ch4 ?? '', [Validators.required]),
      n2o: new FormControl(data?.n2o ?? '', [Validators.required]),
      status: new FormControl(data?.status || 1, [Validators.required]),
    });
  }
}
