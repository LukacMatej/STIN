import {NgForOf, NgIf} from '@angular/common'
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MatButton} from '@angular/material/button'
import {MatCheckbox} from '@angular/material/checkbox'
import {provideNativeDateAdapter} from '@angular/material/core'
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker'
import {MatFormField, MatHint, MatSuffix} from '@angular/material/form-field'
import {MatInput} from '@angular/material/input'
import {MatOption, MatSelect} from '@angular/material/select'
import {TranslateModule} from '@ngx-translate/core'

import {ColumnDefModel, ColumnType} from '../model/column-def.model'
import {EnumColumnTypeModel} from '../model/enum-column-type.model'

/**
 * Component to display and manage filters for a table.
 */
@Component({
  selector: 'app-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    MatFormField,
    MatSelect,
    MatInput,
    MatOption,
    MatButton,
    MatCheckbox,
    TranslateModule,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatHint,
    MatSuffix
  ],
  providers: [provideNativeDateAdapter()],
  schemas: [],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  @Input({required: true}) columns: ColumnDefModel[] = []
  @Output() filter = new EventEmitter<ColumnDefModel[]>()

  /**
   * Applies the filters to the columns by emitting the updated columns to the parent component.
   */
  applyFilters() {
    this.filter.emit(this.columns)
  }

  /**
   * Checks if the provided column type is an [EnumColumnTypeModel]{@link EnumColumnTypeModel}.
   *
   * @param type The column type to check.
   * @returns True if the column type is an enum column type, false otherwise.
   */
  isEnumColumnType(type: ColumnType): type is EnumColumnTypeModel {
    return type instanceof EnumColumnTypeModel
  }

  /**
   * Clears the filters of all columns.
   */
  clearFilters() {
    this.columns.forEach(column => {
      column.filterCriteria.value = null
    })
    this.applyFilters()
  }
}
