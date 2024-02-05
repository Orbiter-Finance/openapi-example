import { IOrbiterSelectType } from "@/Models/commponets";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  } from "@/components/ui/select";
import { useRecoilState } from "recoil";
  export function OrbiterSelectGroup({
    atomKey,
    placeholder,
    selectList,
    triggerClassName,
    changeCall,
    disabled
}: IOrbiterSelectType & {
  changeCall?: (value: string)=> void
} ) {

    const [value, setValue] = useRecoilState(atomKey);

    return (
      <Select disabled={disabled} value={value.value} onValueChange={(value)=>{
        const group = selectList.filter((item)=> item.value === value)[0]
        setValue(group)
        changeCall && changeCall(value)
      }}>
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper">
          {selectList?.map((value, index) => {
            return (
              <SelectItem value={value.value} key={index} >
                {value.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  }
  