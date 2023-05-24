import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { MealInfoAdd } from '@/models/meal_info';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function addMealCheckboxes(
  allIngNames: string[],
  ingNames: string[], 
  setIngNames: React.Dispatch<React.SetStateAction<string[]>>
  ) {
  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={allIngNames}
      disableCloseOnSelect
      getOptionLabel={(ing_name) => ing_name}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
            onChange={(e) => {
                if (e.target.checked)
                    setIngNames([...ingNames, e.target.name])
                else
                    setIngNames(ingNames.filter((n) => n != e.target.name));
            }}
          />
          {option}
        </li>
      )}
      style={{ width: 500, paddingTop: 30 }}
      renderInput={(params) => (
        <TextField {...params} label="选择菜品原料" placeholder="" />
      )}
    />
  );
}