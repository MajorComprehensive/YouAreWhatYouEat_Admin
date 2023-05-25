import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const TAGS = [
    '单锅', '拼锅', '全新套餐', '季节新品', '牛羊肉类', '水产鱼类', '丸滑虾类', '美味主食', '豆面制品', '根茎菌菇', '酒水', '甜点小食'
  ]

export default function addMealTagCheckboxes(tags: string[], setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>) {
  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={TAGS}
      disableCloseOnSelect
      getOptionLabel={(tag) => tag}
      onChange={(e, v) => {
        setSelectedTags(v);
        console.log(v);
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      )}
      style={{ width: 500, paddingTop: 30 }}
      renderInput={(params) => (
        <TextField {...params} label="选择菜品标签" placeholder="" />
      )}
    />
  );
}