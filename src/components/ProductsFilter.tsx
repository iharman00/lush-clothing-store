"use client";

import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import FilterSelect from "./FilterSelect";
import { Color } from "@/sanity/types";

export type FilterOption = {
  _id: string;
  name: string;
  slug: string;
  color?: Color;
};

interface ProductsFilterProps {
  filtersData: {
    colorOptions: FilterOption[];
    sizeOptions: FilterOption[];
    fitOptions: FilterOption[];
    priceOptions: FilterOption[];
  };
}

export type FormSchema = {
  color: string;
  size: string;
  fit: string;
  price: string;
};

const ProductsFilter = ({ filtersData }: ProductsFilterProps) => {
  const { colorOptions, fitOptions, priceOptions, sizeOptions } = filtersData;
  const [colorSlug, setColorSlug] = useQueryState("color");
  const [sizeSlug, setSizeSlug] = useQueryState("size");
  const [fitSlug, setFitSlug] = useQueryState("fit");
  const [priceFilter, setPriceFilter] = useQueryState("price");

  const form = useForm<FormSchema>({
    defaultValues: {
      color: "",
      size: "",
      fit: "",
      price: "",
    },
  });

  // Handle form submission to update URL parameters
  const onSubmit = (data: FormSchema) => {
    setColorSlug(data.color || null);
    setSizeSlug(data.size || null);
    setFitSlug(data.fit || null);
    setPriceFilter(data.price || null);
    form.reset(data);
  };

  // Checks if any filter has an option selected
  const isAnyFilterActive = Object.values(form.getValues()).some(
    (value) => value
  );

  // Clears form values and resets query parameters
  const clearFilters = () => {
    form.reset({ color: "", size: "", fit: "", price: "" });
    setColorSlug(null);
    setSizeSlug(null);
    setFitSlug(null);
    setPriceFilter(null);
  };

  // Synchronize form values with URL query params on load
  useEffect(() => {
    const filters = {
      color: colorSlug,
      size: sizeSlug,
      fit: fitSlug,
      price: priceFilter,
    };
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        form.setValue(key as keyof FormSchema, value, {
          shouldTouch: true,
        });
      }
    });
  }, [colorSlug, sizeSlug, fitSlug, priceFilter, form]);

  return (
    <div className="mt-8 px-[1rem] md:px-[2rem]">
      <ScrollArea>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex space-x-4 mb-6"
          >
            {/* Color Filter */}
            {colorOptions.length > 0 && (
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FilterSelect
                      placeholder="Color"
                      options={colorOptions}
                      onValueChange={field.onChange}
                      value={field.value}
                    />
                  </FormItem>
                )}
              />
            )}

            {/* Fit Filter */}
            {fitOptions.length > 0 && (
              <FormField
                control={form.control}
                name="fit"
                render={({ field }) => (
                  <FormItem>
                    <FilterSelect
                      placeholder="Fit"
                      options={fitOptions}
                      onValueChange={field.onChange}
                      value={field.value}
                    />
                  </FormItem>
                )}
              />
            )}

            {/* Size Filter */}
            {sizeOptions.length > 0 && (
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FilterSelect
                      placeholder="Size"
                      options={sizeOptions}
                      onValueChange={field.onChange}
                      value={field.value}
                    />
                  </FormItem>
                )}
              />
            )}

            {/* Price Filter */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FilterSelect
                    placeholder="Price"
                    options={priceOptions}
                    onValueChange={field.onChange}
                    value={field.value}
                  />
                </FormItem>
              )}
            />

            {/* Form Submit and Clear Controls */}
            {form.formState.isDirty && <Button type="submit">Apply</Button>}
            {isAnyFilterActive && (
              <Button type="button" variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </form>
        </Form>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default ProductsFilter;
