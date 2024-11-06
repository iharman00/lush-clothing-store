"use client";

import { Color, Slug } from "@/sanity/types";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { priceFiltersQueryMap } from "@/sanity/dynamicQueries/fetchProducts";

type FilterOption =
  | {
      _id: string;
      name: string | null;
      slug: Slug | null;
    }
  | {
      _id: string;
      name: string | null;
      slug: Slug | null;
      color: Color | null;
    };

interface ProductsFilterProps {
  filtersData: {
    colors: FilterOption[];
    sizes: FilterOption[];
    fits: FilterOption[];
  };
}

type filtersFormType = {
  color: string;
  size: string;
  fit: string;
  price: string;
};

const ProductsFilter = ({ filtersData }: ProductsFilterProps) => {
  const [colorSlug, setColorSlug] = useQueryState("color");
  const [sizeSlug, setSizeSlug] = useQueryState("size");
  const [fitSlug, setFitSlug] = useQueryState("fit");
  const [priceFilter, setPriceFilter] = useQueryState("price");

  const form = useForm<filtersFormType>({
    defaultValues: {
      color: "",
      size: "",
      fit: "",
      price: "",
    },
  });

  // Synchronize form values with URL query state on load
  useEffect(() => {
    const filters = {
      color: colorSlug,
      size: sizeSlug,
      fit: fitSlug,
      price: priceFilter,
    };
    Object.entries(filters).forEach(([key, value]) => {
      if (value) form.setValue(key as keyof filtersFormType, value);
    });
  }, [colorSlug, sizeSlug, fitSlug, priceFilter, form]);

  // Handle form submission to update URL parameters
  const onSubmit = (data: filtersFormType) => {
    setColorSlug(data.color || null);
    setSizeSlug(data.size || null);
    setFitSlug(data.fit || null);
    setPriceFilter(data.price || null);
  };

  const FilterSelect = ({
    name,
    placeholder,
    options,
  }: {
    name: keyof filtersFormType;
    placeholder: string;
    options: FilterOption[];
  }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) =>
                option.name && option.slug?.current ? (
                  <SelectItem key={option._id} value={option.slug.current}>
                    {option.name}
                  </SelectItem>
                ) : null
              )}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );

  // Price filter mapping to ensure proper typing and content
  const priceOptions = Object.keys(priceFiltersQueryMap).map((key, index) => ({
    _id: String(index),
    name: priceFiltersQueryMap[key as keyof typeof priceFiltersQueryMap]
      .displayName,
    slug: key,
  }));

  return (
    <div className="mt-8 px-[1rem] md:px-[2rem]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex space-x-4 mb-6"
        >
          <FilterSelect
            name="color"
            placeholder="Color"
            options={filtersData.colors}
          />
          <FilterSelect
            name="size"
            placeholder="Size"
            options={filtersData.sizes}
          />
          <FilterSelect
            name="fit"
            placeholder="Fit"
            options={filtersData.fits}
          />

          {/* Price Range Filter */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {priceOptions.map((priceOption) => (
                      <SelectItem
                        key={priceOption._id}
                        value={priceOption.slug}
                      >
                        {priceOption.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {form.formState.isDirty && <Button type="submit">Apply</Button>}
          {form.formState.isDirty && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setColorSlug(null);
                setSizeSlug(null);
                setFitSlug(null);
                setPriceFilter(null);
              }}
            >
              Clear
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default ProductsFilter;
