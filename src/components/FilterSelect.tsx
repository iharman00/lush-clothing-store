import { FormControl } from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { FilterOption } from "./ProductsFilter";

type FilterSelectProps = {
  onValueChange: (value: string) => void;
  value: string;
  placeholder: string;
  options: FilterOption[];
};

const FilterSelect = ({
  placeholder,
  options,
  onValueChange,
  value,
}: FilterSelectProps) => {
  return (
    <Select onValueChange={onValueChange} value={value}>
      <FormControl>
        <SelectTrigger className="w-32">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option._id} value={option.slug}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
export default FilterSelect;
